import { expect } from 'chai';
import * as template from '.';
import { Template } from './Template';

describe('entry-point', () => {
  it('creates a [Template]', async () => {
    const res = await template.create();
    expect(res).to.be.an.instanceof(Template);
  });
});
