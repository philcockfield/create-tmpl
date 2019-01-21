import { log } from '../libs';
import * as exec from '../util.exec';
import { INpmInfo } from './types';
export * from './types';

/**
 * Lookup latest info for module from NPM.
 */
export async function getInfo(
  moduleName: string,
): Promise<INpmInfo | undefined> {
  try {
    const json = await getJson(moduleName);
    const name = json.name;
    const latest = json['dist-tags'].latest;
    return {
      name,
      latest,
      json,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Lookup the latest version of a module on NPM.
 */
export async function getVersion(moduleName: string) {
  const json = await getJson(moduleName);
  if (!json) {
    throw new Error(
      `Cannot get version of '${moduleName}' as it could not be found on NPM.`,
    );
  }
  const dist = json['dist-tags'];
  return dist ? dist.latest : '';
}

/**
 * Looks up the latest version for each key/value pair
 * eg { dependences } on a package.json file.
 */
export async function getVersions(deps: { [moduleName: string]: string }) {
  deps = { ...deps };
  const wait = Object.keys(deps).map(async moduleName => {
    const current = deps[moduleName].trim();
    let version = await getVersion(moduleName);
    version = current.startsWith('^') ? `^${version}` : version;
    deps[moduleName] = version;
  });
  await Promise.all(wait);
  return deps;
}

/**
 * INTERNAL
 */
async function getJson(moduleName: string, options: string = ''): Promise<any> {
  const cmd = `npm info ${moduleName} --json ${options}`.trim();

  const parseJson = (text: string) => {
    try {
      const json = JSON.parse(text);
      return json;
    } catch (error) {
      log.error('Raw JSON text:');
      log.info(text);
      throw error;
    }
  };

  try {
    const result = await exec.run(cmd, { silent: true });
    return result.stdout ? parseJson(result.stdout) : undefined;
  } catch (error) {
    if (error.message.includes('Not found')) {
      return undefined; // Return nothing indicating the module was not found on NPM.
    } else {
      throw new Error(
        `Failed while reading info for '${moduleName}' from NPM.\nCMD: ${log.yellow(
          cmd,
        )}\n\n${error.message}`,
      );
    }
  }
}
