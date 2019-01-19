import { R, fs, fsPath, glob, isBinaryFile, value } from '../common';
import {
  IProcessResponse,
  ITemplateFile,
  ITemplateSource,
  TemplateProcessor,
} from '../types';
import { Request } from './Request';

/**
 * Represents a set of template files to transform.
 */
export class Template {
  /**
   * Creates a new template-plan.
   */
  public static create(source?: ITemplateSource | ITemplateSource[]) {
    const sources = source ? (Array.isArray(source) ? source : [source]) : [];
    let tmpl = new Template({});
    sources.forEach(source => (tmpl = tmpl.add(source)));
    return tmpl;
  }

  /**
   * Constructor.
   */
  private constructor(args: {
    processors?: TemplateProcessor[];
    sources?: ITemplateSource[];
  }) {
    const { processors, sources } = args;
    this.config.processors = processors || this.config.processors;
    this.config.sources = sources || this.config.sources;
  }

  /**
   * Internal configuration.
   */
  private readonly config = {
    processors: [] as TemplateProcessor[],
    sources: [] as ITemplateSource[],
    cache: {
      files: undefined as ITemplateFile[] | undefined,
    },
  };

  /**
   * The source file patterns that make up this template.
   */
  public get sources() {
    return this.config.sources;
  }

  /**
   * Adds a new template source (pointer to it's directory/files).
   */
  public add(source: ITemplateSource | Template) {
    let sources =
      source instanceof Template
        ? [...this.sources, ...source.sources]
        : [...this.sources, source];
    sources = R.uniq(sources);
    const processors = this.config.processors;
    return new Template({ sources, processors });
  }

  /**
   * Registers a template processor.
   */
  public processor(fn: TemplateProcessor) {
    const processors = [...this.config.processors, fn];
    const sources = this.config.sources;
    return new Template({ processors, sources });
  }

  /**
   * Generates the set of files (cached).
   */
  public async files(options: { cache?: boolean } = {}) {
    // Look for cached value.
    const cache = value.defaultValue(options.cache, true);
    if (cache && this.config.cache.files) {
      return this.config.cache.files;
    }

    // Look up files.
    const wait = this.sources.map(source => getFiles(source));
    let files = value.flatten(await Promise.all(wait)) as ITemplateFile[];

    // Remove duplicates with "overriden" files.
    // NB: The duplicate files from templates added AFTER earlier templates
    //     override the earlier template files.
    const exists = (file: ITemplateFile, list: ITemplateFile[]) =>
      list.findIndex(f => f.path === file.path) > -1;
    files = files
      .reverse()
      .reduce(
        (acc, next) => (exists(next, acc) ? acc : [...acc, next]),
        [] as ITemplateFile[],
      )
      .reverse();

    // Finish up.
    this.config.cache.files = files;
    return files;
  }

  /**
   * Runs the execution pipeline.
   */
  public async execute(args: { cache?: boolean } = {}) {
    const { cache } = args;
    const processors = this.config.processors;
    if (processors.length === 0) {
      return;
    }

    // Run the processor pipe-line.
    const files = await this.files({ cache });
    const wait = files.map(file => runProcessors({ processors, file }));

    // Finish up.
    await Promise.all(wait);
  }
}

/**
 * INTERNAL
 */
async function getFiles(source: ITemplateSource) {
  const { dir, pattern = '**' } = source;
  const base = fsPath.resolve(dir);
  const path = fsPath.join(base, pattern);
  const paths = await glob.find(fsPath.resolve(path), {
    type: 'FILES',
    dot: true,
  });
  const wait = paths.map(async path => {
    const file: ITemplateFile = {
      source,
      base,
      path: path.substr(base.length),
      isBinary: await isBinaryFile(path),
    };
    return file;
  });
  return Promise.all(wait);
}

function runProcessors(args: {
  processors: TemplateProcessor[];
  file: ITemplateFile;
}) {
  return new Promise(async (resolve, reject) => {
    const { processors, file } = args;
    let isResolved = false;

    try {
      const done = () => {
        if (!isResolved) {
          isResolved = true;
          resolve();
        }
      };

      const buffer = await fs.readFile(fsPath.join(file.base, file.path));
      let text = file.isBinary ? undefined : buffer.toString();

      const res: IProcessResponse = {
        next: () => runNext(),
        complete: () => done(),

        text(change: string) {
          text = change;
          return res;
        },

        replaceText(searchValue, replaceValue) {
          text =
            text === undefined
              ? undefined
              : text.replace(searchValue, replaceValue);
          return res;
        },
      };

      const runProcessor = async (index: number) => {
        const fn = processors[index];
        if (isResolved || !fn) {
          return;
        }
        const path = file.path;
        const content = text || buffer;
        const req = new Request({ path, content });
        fn(req, res);
      };

      let index = 0;
      const runNext = () => {
        index++;
        if (index < processors.length) {
          runProcessor(index);
        } else {
          done();
        }
      };

      runProcessor(0);
    } catch (error) {
      reject(error);
    }
  });
}
