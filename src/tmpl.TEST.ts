import { expect } from 'chai';
import { tmpl } from '.';
import { Template } from './api';

describe('entry-point', () => {
  it('creates a [Template]', async () => {
    const res = await tmpl.create();
    expect(res).to.be.an.instanceof(Template);
  });
});
