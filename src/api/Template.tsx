import { R, fs, fsPath, glob, isBinaryFile, value } from '../common';
import {
  IProcessTemplateResponse,
  ITemplateFile,
  ITemplateSource,
  TemplateProcessor,
  TemplateFilter,
  ITemplateVariables,
} from '../types';
import { TemplateRequest } from './TemplateRequest';

export type AddTemplateSource =
  | ITemplateSource
  | ITemplateSource[]
  | Template
  | Template[]
  | string
  | string[];

export type ITemplateArgs = {
  sources?: ITemplateSource[];
  filters?: TemplateFilter[];
  processors?: TemplateProcessor[];
};

/**
 * Represents a set of template files to transform.
 */
export class Template {
  /**
   * Creates a new template-plan.
   */
  public static create(source?: AddTemplateSource) {
    const tmpl = new Template({});
    return source ? tmpl.add(source) : tmpl;
  }

  /**
   * Constructor.
   */
  private constructor(args: ITemplateArgs) {
    const { sources, filters, processors } = args;
    this.config.sources = sources || this.config.sources;
    this.config.filters = filters || this.config.filters;
    this.config.processors = processors || this.config.processors;
  }

  /**
   * Creates a clone of the Template.
   */
  public clone(args: ITemplateArgs = {}) {
    return new Template({
      sources: args.sources || this.config.sources,
      processors: args.processors || this.config.processors,
      filters: args.filters || this.config.filters,
    });
  }

  /**
   * Internal configuration.
   */
  private readonly config = {
    processors: [] as TemplateProcessor[],
    sources: [] as ITemplateSource[],
    filters: [] as TemplateFilter[],
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
  public add(source: AddTemplateSource) {
    let sources: ITemplateSource[] = [...this.sources];

    const list = Array.isArray(source) ? source : [source];
    list.forEach(item => {
      if (item instanceof Template) {
        return (sources = [...sources, ...item.sources]);
      }
      if (typeof item === 'string') {
        return (sources = [...sources, { dir: item }]);
      }
      return (sources = [...sources, item]);
    });

    sources = R.uniq(sources);
    return this.clone({ sources });
  }

  /**
   * Filter the set of files.
   */
  public filter(fn: TemplateFilter) {
    const filters = [...this.config.filters, fn];
    return this.clone({ filters });
  }

  /**
   * Register a template processor.
   */
  public process<V extends ITemplateVariables = {}>(fn: TemplateProcessor<V>) {
    const processors = [...this.config.processors, fn];
    return this.clone({ processors });
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

    // Lookup files.
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

    // Apply any filters.
    const filters = this.config.filters;
    files =
      filters.length === 0
        ? files
        : files.filter(file => filters.every(filter => filter(file)));

    // Finish up.
    this.config.cache.files = files;
    return files;
  }

  /**
   * Runs the execution pipeline.
   */
  public async execute<V extends ITemplateVariables = {}>(
    args: {
      variables?: V;
      cache?: boolean;
    } = {},
  ) {
    const { cache, variables = {} } = args;
    const processors = this.config.processors;
    if (processors.length === 0) {
      return;
    }

    // Run the processor pipe-line.
    const files = await this.files({ cache });
    const wait = files.map(file =>
      runProcessors({ processors, file, variables }),
    );

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
  variables: ITemplateVariables;
  processors: TemplateProcessor[];
  file: ITemplateFile;
}) {
  return new Promise(async (resolve, reject) => {
    const { processors, file, variables } = args;
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

      const res: IProcessTemplateResponse = {
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
        const req = new TemplateRequest({ path, content, variables });
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
