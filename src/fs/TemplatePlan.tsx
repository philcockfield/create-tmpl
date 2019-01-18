// import { value, fs, fsPath, glob } from '../common';
import { ITemplateSource } from '../types';

/**
 * Represents a set of template files to transform.
 */
export class TemplatePlan {
  /**
   * Creates a new template-plan.
   */
  public static create(source?: ITemplateSource | ITemplateSource[]) {
    const sources = source ? (Array.isArray(source) ? source : [source]) : [];
    let tmpl = new TemplatePlan({});
    sources.forEach(source => (tmpl = tmpl.add(source)));
    return tmpl;
  }

  /**
   * Constructor.
   */
  private constructor(args: { sources?: ITemplateSource[] }) {
    const { sources = [] } = args;
    this.config.sources = sources;
  }

  /**
   * Fields.
   */
  public readonly config = {
    sources: [] as ITemplateSource[],
  };

  /**
   * Adds a new template source (pointer to it's directory/files).
   */
  public add(source: ITemplateSource) {
    const sources = [...this.config.sources, source];
    return new TemplatePlan({ sources });
  }
}

// /**
//  * Converts a raw path to a set of files, expanding out a glob
//  * pattern if necessary, to set of template-file objects.
//  * @param path: Path(s) to the template files (glob pattern).
//  */
// public static async toTemplateFiles(path: string) {
//   const paths = await glob.find(fsPath.resolve(path), {
//     type: 'FILES',
//     dot: true,
//   });
//   const items = await Promise.all(
//     paths.map(async path => {
//       const exists = await fs.pathExists(path);
//       return { path, exists };
//     }),
//   );
//   return items.filter(item => item.exists).map(({ path }) => path);
// }
