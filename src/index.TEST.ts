import { expect } from 'chai';
import { tmpl } from '.';
import { TemplatePlan } from './fs/TemplatePlan';

describe('entry-point', () => {
  it('creates a TemplatePlan', async () => {
    const plan = await tmpl.create('.');
    expect(plan).to.be.an.instanceof(TemplatePlan);
  });
});
