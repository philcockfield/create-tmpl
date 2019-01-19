import { npm, log } from '.';

describe.skip('util.npm (integration)', () => {
  it.skip('getInfo', async () => {
    const res = await npm.getInfo('create-tmpl');
    log.info(res);
  });

  it.skip('getVersion', async () => {
    const res = await npm.getVersion('create-tmpl');
    log.info(res);
  });
});
