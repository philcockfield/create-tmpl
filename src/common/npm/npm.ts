import { semver } from '../libs';
import { NpmPackage } from './NpmPackage';

export { semver };
export * from './get';

export const pkg = (dir?: string) => NpmPackage.create(dir);
