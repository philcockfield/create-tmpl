import { expect } from 'chai';
import { npm, log } from '.';

describe('util.npm (integration)', () => {
  it.skip('getInfo', async () => {
    const res = await npm.getInfo('create-tmpl');
    log.info(res);
  });

  it.skip('getVersion', async () => {
    const res = await npm.getVersion('create-tmpl');
    log.info(res);
  });

  it.skip('getVersions', async () => {
    const deps = { react: 'x', 'react-dom': 'x' };
    const res = await npm.getVersions(deps);
    expect(res).to.not.equal(deps);
    log.info(res);
  });
});
