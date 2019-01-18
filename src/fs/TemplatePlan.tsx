import { value, fs, fsPath, glob } from '../common';
import { ITemplateFile } from '../types';

/**
 * Represents a set of template files to transform.
 *
 */
export class TemplatePlan {
  /**
   * Creates a new plan.
   * @param path: Path(s) to the template files (glob pattern).
   */
  public static async create(path: string | string[]) {
    let paths = Array.isArray(path) ? path : [path];
    paths = value.flatten(
      await Promise.all(paths.map(p => TemplatePlan.toTemplateFiles(p))),
    );
    return new TemplatePlan({ paths });
  }

  /**
   * Converts a raw path to a set of files, expanding out a glob
   * pattern if necessary, to set of template-file objects.
   * @param path: Path(s) to the template files (glob pattern).
   */
  public static async toTemplateFiles(path: string) {
    const paths = await glob.find(fsPath.resolve(path), {
      type: 'FILES',
      dot: true,
    });
    const items = await Promise.all(
      paths.map(async path => {
        const exists = await fs.pathExists(path);
        return { path, exists };
      }),
    );
    return items.filter(item => item.exists).map(({ path }) => path);
  }

  /**
   * Constructor.
   */
  private constructor(args: { paths: string[] }) {
    const { paths } = args;
    this.paths = paths;
  }

  /**
   * Fields.
   */
  public paths: string[];
  // public readonly files: ITemplateFile[];

  /**
   * Adds a new path of source template(s).
   */
  public add(path: string | string[]) {
    // let paths = Array.isArray(path) ? path : [path];
    // paths = value.flatten(
    //   await Promise.all(paths.map(p => TemplatePlan.toTemplateFiles(p))),
    // );
  }
}
