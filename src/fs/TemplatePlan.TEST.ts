import { expect } from 'chai';
import { TemplatePlan } from '.';

describe('TemplatePlan', () => {
  describe('create', () => {
    it('it has no sources by default', () => {
      const tmpl = TemplatePlan.create();
      expect(tmpl.config.sources).to.eql([]);
    });

    it('takes source within `create` method (single)', () => {
      const source = { dir: '.' };
      const tmpl = TemplatePlan.create(source);
      expect(tmpl.config.sources.length).to.eql(1);
      expect(tmpl.config.sources[0]).to.eql(source);
    });

    it('takes sources within `create` method (array)', () => {
      const sources = [
        { dir: './tmpl-1' },
        { dir: './tmpl-2/foo', pattern: '*.ts' },
      ];
      const tmpl = TemplatePlan.create(sources);
      expect(tmpl.config.sources.length).to.eql(2);
      expect(tmpl.config.sources).to.eql(sources);
    });
  });

  describe('add', () => {
    it('adds a configuration source (new instance)', () => {
      const tmpl1 = TemplatePlan.create();
      const tmpl2 = tmpl1.add({ dir: '.' });
      expect(tmpl1.config.sources).to.eql([]);
      expect(tmpl2.config.sources).to.eql([{ dir: '.' }]);
      expect(tmpl1).to.not.equal(tmpl2); // NB: new instance created.
    });

    it('chaining', () => {
      const tmpl = TemplatePlan.create()
        .add({ dir: './tmpl-1' })
        .add({ dir: './tmpl-2' });
      expect(tmpl.config.sources).to.eql([
        { dir: './tmpl-1' },
        { dir: './tmpl-2' },
      ]);
    });
  });

  // describe('files', () => {
  //   it('has no files (empty array)', async () => {
  //     const tmpl = await TemplatePlan.create([]);
  //     expect(tmpl.paths).to.eql([]);
  //   });

  //   it('has no files (path does not exist)', async () => {
  //     const tmpl = await TemplatePlan.create('./NO_EXIST/readme.md');
  //     expect(tmpl.paths).to.eql([]);
  //   });

  //   it('has a single file', async () => {
  //     const tmpl = await TemplatePlan.create('./example/tmpl-1/README.md');
  //     expect(tmpl.paths.length).to.eql(1);
  //     expect(tmpl.paths[0].endsWith('tmpl-1/README.md')).to.eql(true);
  //   });

  //   it('has several files (single glob)', async () => {
  //     const tmpl = await TemplatePlan.create('./example/tmpl-1/*');
  //     const names = tmpl.paths.map(p => fsPath.basename(p));
  //     expect(names).to.include('.babelrc');
  //     expect(names).to.include('.gitignore');
  //     expect(names).to.include('README.md');
  //   });

  //   it.skip('overrides files from secondary path', () => {
  //     // console.log('foo', 123);
  //   });
  // });
});
