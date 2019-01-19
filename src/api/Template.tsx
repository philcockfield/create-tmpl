import { fsPath, glob, value } from '../common';
import { ITemplateFile, ITemplateSource } from '../types';

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
  private constructor(args: { sources?: ITemplateSource[] }) {
    const { sources = [] } = args;
    this.sources = sources;
  }

  /**
   * Fields.
   */
  public readonly sources: ITemplateSource[] = [];
  private readonly _cache = {
    files: undefined as ITemplateFile[] | undefined,
  };

  /**
   * Adds a new template source (pointer to it's directory/files).
   */
  public add(source: ITemplateSource | Template) {
    const sources =
      source instanceof Template
        ? [...this.sources, ...source.sources]
        : [...this.sources, source];
    return new Template({ sources });
  }

  /**
   * Generates the set of files (cached).
   */
  public async files(options: { force?: boolean } = {}) {
    const { force = false } = options;

    // Manage cache.
    if (force) {
      this._cache.files = undefined;
    }
    if (this._cache.files) {
      return this._cache.files;
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
    this._cache.files = files;
    return files;
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
    path = path.substr(base.length);
    const file: ITemplateFile = { source, base, path };
    return file;
  });
  return Promise.all(wait);
}
