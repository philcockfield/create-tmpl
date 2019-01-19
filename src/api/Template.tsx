import * as processors from '../processors';
import { fs, fsPath, glob, value, isBinaryFile } from '../common';
import {
  ITemplateFile,
  ITemplateSource,
  IProcessRequest,
  IProcessResponse,
  TemplateProcessor,
} from '../types';

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
  private constructor(args: {}) {}

  /**
   * Fields.
   */
  private readonly config = {
    cache: {
      files: undefined as ITemplateFile[] | undefined,
    },
    processors: [] as TemplateProcessor[],
    sources: [] as ITemplateSource[],
  };

  // private _events$ = new Subject<ITemplateEvent>();
  // public readonly events$ = this._events$.pipe(share());

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
    this.config.sources =
      source instanceof Template
        ? [...this.sources, ...source.sources]
        : [...this.sources, source];
    return this;
  }

  /**
   * Registers a template processor.
   */
  public processor(fn: TemplateProcessor) {
    this.config.processors = [...this.config.processors, fn];
    return this;
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
    // const dir = fsPath.resolve(args.dir);

    // Handle existing target location.
    // const exists = await fs.pathExists(dir);
    // if (exists && !replace) {
    //   // Directry already exists - fail.
    //   const err = `Cannot write template, the target path already exists: ${dir}`;
    //   throw new Error(err);
    // }
    // if (exists && replace === true) {
    //   // Directory already exists and a "replace" was requested.
    //   await fs.remove(dir);
    //   await fs.ensureDir(dir);
    // }

    // Fire events.
    const files = await this.files({ cache });
    const wait = files.map(file => {
      return new Promise(async (resolve, reject) => {
        try {
          const path = fsPath.join(file.base, file.path);
          let isResolved = false;
          const done = () => {
            if (!isResolved) {
              isResolved = true;
              resolve();
            }
          };

          let index = 0;
          const buffer = await fs.readFile(path);
          let text = file.isBinary ? undefined : buffer.toString();

          const res: IProcessResponse = {
            text: (change: string) => {
              text = change;
              return res;
            },
            replaceText: (searchValue, replaceValue) => {
              text =
                text === undefined
                  ? undefined
                  : text.replace(searchValue, replaceValue);
              return res;
            },

            next: () => {
              index++;
              if (index < processors.length) {
                runProcessor(index);
              } else {
                done();
              }
            },
            complete: () => {
              done();
            },
          };

          const runProcessor = async (index: number) => {
            const fn = processors[index];
            if (!isResolved && fn) {
              const req: IProcessRequest = { file, buffer, text };
              fn(req, res);
            }
          };
          runProcessor(0);
        } catch (error) {
          reject(error);
        }
      });
    });

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
