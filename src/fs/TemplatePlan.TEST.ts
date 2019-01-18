import { expect } from 'chai';
import { TemplatePlan } from '.';
import { fsPath } from '../common';

describe('TemplatePlan', () => {
  describe('files', () => {
    it('has no files (empty array)', async () => {
      const tmpl = await TemplatePlan.create([]);
      expect(tmpl.paths).to.eql([]);
    });

    it('has no files (path does not exist)', async () => {
      const tmpl = await TemplatePlan.create('./NO_EXIST/readme.md');
      expect(tmpl.paths).to.eql([]);
    });

    it('has a single file', async () => {
      const tmpl = await TemplatePlan.create('./example/tmpl-1/README.md');
      expect(tmpl.paths.length).to.eql(1);
      expect(tmpl.paths[0].endsWith('tmpl-1/README.md')).to.eql(true);
    });

    it.only('has several files (single glob)', async () => {
      const tmpl = await TemplatePlan.create('./example/tmpl-1/*');
      const names = tmpl.paths.map(p => fsPath.basename(p));
      expect(names).to.include('.babelrc');
      expect(names).to.include('.gitignore');
      expect(names).to.include('README.md');
    });
  });
});
