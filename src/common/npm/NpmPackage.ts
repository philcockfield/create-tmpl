import { fs, fsPath } from '../libs';
import {
  INpmPackageFields,
  NpmPackageFieldsKey,
  INpmPackageJson,
} from './types';

/**
 * Represents a `package.json`.
 */
export class NpmPackage {
  public static create = (dir?: string) => new NpmPackage(dir);

  public readonly path: string;
  public readonly exists: boolean;
  public json: INpmPackageJson;

  private constructor(dir?: string) {
    dir = dir ? dir : '.';
    dir = dir.trim();
    dir = dir.endsWith('package.json') ? dir : fsPath.join(dir, 'package.json');
    this.path = dir;
    this.exists = fs.existsSync(this.path);
    this.json = this.exists ? fs.readJSONSync(this.path) : {};
  }

  /**
   * Fields
   */
  public get name() {
    return this.json.name;
  }
  public get description() {
    return this.json.description;
  }
  public get version() {
    return this.json.version;
  }
  public get main() {
    return this.json.main;
  }
  public get scripts() {
    return this.json.scripts || {};
  }
  public get dependencies() {
    return this.json.dependencies || {};
  }
  public get devDependencies() {
    return this.json.devDependencies || {};
  }
  public get peerDependencies() {
    return this.json.peerDependencies || {};
  }
  public get resolutions() {
    return this.json.resolutions || {};
  }

  /**
   * Saves changes to the `package.json` file.
   */
  public save(path?: string) {
    const json = JSON.stringify(this.json, null, '  ');
    fs.writeFileSync(path || this.path, `${json}\n`);
  }

  /**
   * Adds fields to the specified field-set.
   */
  public addFields(
    key: NpmPackageFieldsKey,
    fields: INpmPackageFields,
    options: { force?: boolean } = {},
  ) {
    const { force } = options;
    const json = { ...this.json };
    const target = (this.json[key] || {}) as INpmPackageFields;
    json[key] = NpmPackage.addFields(fields, target, { force });
    this.json = json;
    return this;
  }

  /**
   * Removes fields from the specified field-set.
   */
  public removeFields(
    key: NpmPackageFieldsKey,
    fields: INpmPackageFields | string[],
    options: {
      force?: boolean;
      exclude?: string | string[];
    } = {},
  ) {
    const { force, exclude } = options;
    const json = { ...this.json };
    const target = (this.json[key] || {}) as INpmPackageFields;
    json[key] = NpmPackage.removeFields(fields, target, { force, exclude });
    this.json = json;
    return this;
  }

  /**
   * Adds a set of fields to a target object.
   */
  public static addFields(
    source: INpmPackageFields,
    target: INpmPackageFields,
    options: { force?: boolean } = {},
  ) {
    const { force = false } = options;
    target = { ...target };
    Object.keys(source).forEach(key => {
      const value = (source[key] || '').trim();
      if (value && (force || !target[key])) {
        target[key] = value;
      }
    });
    return target;
  }

  /**
   * Removes a set of fields from a target object.
   */
  public static removeFields(
    source: INpmPackageFields | string[],
    target: INpmPackageFields,
    options: { force?: boolean; exclude?: string | string[] } = {},
  ) {
    const {
      force = Array.isArray(source), // NB: Always force remove when an array of keys are passed (no values to compare with).
    } = options;

    const keys = Array.isArray(source) ? source : Object.keys(source);
    const exclude = options.exclude
      ? Array.isArray(options.exclude)
        ? options.exclude
        : [options.exclude]
      : [];

    const trim = (value?: string) => (value || '').trim();

    keys
      .filter(key => !exclude.includes(key))
      .forEach(key => {
        const sourceValue = source[key];
        const targetValue = target[key];
        if (force || trim(sourceValue) === trim(targetValue)) {
          delete target[key];
        }
      });
    return target;
  }
}
