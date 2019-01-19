import { log } from './libs';
import * as exec from './util.exec';

export interface INpmInfo {
  name: string;
  latest: string;
  json: any;
}

/**
 * Lookup latest info for module from NPM.
 */
export async function getInfo(
  moduleName: string,
): Promise<INpmInfo | undefined> {
  try {
    const json = await getJson(moduleName);
    const latest = json['dist-tags'].latest;
    const name = json.name;
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
  const json = await getJson(moduleName, '--versions');
  return json[moduleName];
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
