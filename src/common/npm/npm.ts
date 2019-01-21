import { semver } from '../libs';
import { NpmPackage } from './NpmPackage';

export { semver };
export * from './get';
export * from './NpmPackage';

export const pkg = (dir?: string) => NpmPackage.create(dir);
