import { expect } from 'chai';
import { TemplatePlan } from '.';
import { fsPath } from '../common';

describe('TemplatePlan', () => {
  describe('create', () => {
    it('it has no sources by default', () => {
      const tmpl = TemplatePlan.create();
      expect(tmpl.sources).to.eql([]);
    });

    it('takes source within `create` method (single)', () => {
      const source = { dir: '.' };
      const tmpl = TemplatePlan.create(source);
      expect(tmpl.sources.length).to.eql(1);
      expect(tmpl.sources[0]).to.eql(source);
    });

    it('takes sources within `create` method (array)', () => {
      const sources = [
        { dir: './tmpl-1' },
        { dir: './tmpl-2/foo', pattern: '*.ts' },
      ];
      const tmpl = TemplatePlan.create(sources);
      expect(tmpl.sources.length).to.eql(2);
      expect(tmpl.sources).to.eql(sources);
    });
  });

  describe('add', () => {
    it('adds a configuration source (new instance)', () => {
      const tmpl1 = TemplatePlan.create();
      const tmpl2 = tmpl1.add({ dir: '.' });
      expect(tmpl1.sources).to.eql([]);
      expect(tmpl2.sources).to.eql([{ dir: '.' }]);
      expect(tmpl1).to.not.equal(tmpl2); // NB: new instance created.
    });

    it('chaining', () => {
      const tmpl = TemplatePlan.create()
        .add({ dir: './tmpl-1' })
        .add({ dir: './tmpl-2' });
      expect(tmpl.sources).to.eql([{ dir: './tmpl-1' }, { dir: './tmpl-2' }]);
    });

    it('merge in another [tmpl]', () => {
      const tmpl1 = TemplatePlan.create({ dir: './tmpl-1' });
      const tmpl2 = TemplatePlan.create([
        { dir: './tmpl-2' },
        { dir: './tmpl-3' },
      ]);
      const res = tmpl1.add(tmpl2);
      expect(res.sources).to.eql([
        { dir: './tmpl-1' },
        { dir: './tmpl-2' },
        { dir: './tmpl-3' },
      ]);
    });
  });

  describe('files', () => {
    it('has no files (dir does not exist)', async () => {
      const tmpl = TemplatePlan.create({
        dir: './NO_EXIST',
        pattern: '**',
      });
      const files = await tmpl.files();
      expect(files.length).to.eql(0);
    });

    it('has no files (file does not exist)', async () => {
      const tmpl = TemplatePlan.create({
        dir: './example/tmpl-1',
        pattern: 'NO_EXIST.md',
      });
      const files = await tmpl.files();
      expect(files.length).to.eql(0);
    });

    it('has no files (empty dir)', async () => {
      const tmpl = TemplatePlan.create({
        dir: './example/empty',
        pattern: '**',
      });
      const files = await tmpl.files();
      expect(files.length).to.eql(0);
    });

    it('has single file', async () => {
      const source = {
        dir: './example/tmpl-1',
        pattern: 'README.md',
      };
      const tmpl = TemplatePlan.create(source);
      const files = await tmpl.files();
      const file = files[0];

      expect(files.length).to.eql(1);
      expect(file.source).to.eql(source);
      expect(file.base).to.eql(fsPath.resolve(source.dir));
      expect(file.path).to.eql('/README.md');
    });

    it('has multiple files ("**" glob pattern by default)', async () => {
      const tmpl = TemplatePlan.create({ dir: './example/tmpl-1' });
      const files = await tmpl.files();
      const paths = files.map(f => f.path);
      expect(paths).to.include('/.babelrc');
      expect(paths).to.include('/.gitignore');
      expect(paths).to.include('/README.md');
      expect(paths).to.include('/images/face.svg');
      expect(paths).to.include('/src/index.ts');
    });

    it('filter pattern (.ts file only)', async () => {
      const tmpl = TemplatePlan.create({
        dir: './example/tmpl-1',
        pattern: '**/*.ts',
      });
      const files = await tmpl.files();
      const paths = files.map(f => f.path);
      expect(paths).to.eql(['/index.ts', '/src/index.ts']);
    });

    it('caches results', async () => {
      const tmpl = TemplatePlan.create({ dir: './example/tmpl-1' });
      const files1 = await tmpl.files();
      const files2 = await tmpl.files();
      expect(files1).to.equal(files2);
    });

    it('forces new results (override cache)', async () => {
      const tmpl = TemplatePlan.create({ dir: './example/tmpl-1' });
      const files1 = await tmpl.files();
      const files2 = await tmpl.files({ force: true });
      expect(files1).to.not.equal(files2);
    });

    it('override file', async () => {
      const tmpl = TemplatePlan.create()
        .add({ dir: './example/tmpl-2' })
        .add({ dir: './example/sub-folder/tmpl-3' });

      const files = await tmpl.files();
      const readmes = files.filter(f => f.path.endsWith('/README.md'));

      // NB: One README, taken from `tmpl-3` which overrides `tmpl-2`
      //     because `tmpl-3` was added after `tmpl-2`.
      expect(readmes.length).to.eql(1);
      expect(readmes[0].base.endsWith('/tmpl-3')).to.eql(true);
    });
  });
});
