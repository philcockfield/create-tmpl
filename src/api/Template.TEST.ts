import { expect } from 'chai';

import { Template } from '.';
import { fs, fsPath, isBinaryFile } from '../common';

const TEST_DIR = './tmp/test';
const cleanUp = async () => fs.remove(TEST_DIR);

describe('TemplatePlan', () => {
  beforeEach(cleanUp);
  afterEach(cleanUp);

  describe('create', () => {
    it('it has no sources by default', () => {
      const tmpl = Template.create();
      expect(tmpl.sources).to.eql([]);
    });

    it('takes source within `create` method (single)', () => {
      const source = { dir: '.' };
      const tmpl = Template.create(source);
      expect(tmpl.sources.length).to.eql(1);
      expect(tmpl.sources[0]).to.eql(source);
    });

    it('takes sources within `create` method (array)', () => {
      const sources = [
        { dir: './tmpl-1' },
        { dir: './tmpl-2/foo', pattern: '*.ts' },
      ];
      const tmpl = Template.create(sources);
      expect(tmpl.sources.length).to.eql(2);
      expect(tmpl.sources).to.eql(sources);
    });
  });

  describe('add (source template)', () => {
    it('adds as a new instance', () => {
      const tmpl1 = Template.create({ dir: './tmpl-1' });
      const tmpl2 = tmpl1.add({ dir: './tmpl-2' });
      expect(tmpl1).to.not.equal(tmpl2);
      expect(tmpl1.sources).to.eql([{ dir: './tmpl-1' }]);
      expect(tmpl2.sources).to.eql([{ dir: './tmpl-1' }, { dir: './tmpl-2' }]);
    });

    it('add from string', () => {
      const tmpl = Template.create().add('./tmpl-1');
      expect(tmpl.sources).to.eql([{ dir: './tmpl-1' }]);
    });

    it('add from string array', () => {
      const tmpl = Template.create().add(['./tmpl-1', './tmpl-2']);
      expect(tmpl.sources).to.eql([{ dir: './tmpl-1' }, { dir: './tmpl-2' }]);
    });

    it('chaining', () => {
      const tmpl = Template.create()
        .add({ dir: './tmpl-1' })
        .add({ dir: './tmpl-2' });
      expect(tmpl.sources).to.eql([{ dir: './tmpl-1' }, { dir: './tmpl-2' }]);
    });

    it('prevents adding the same template more than once', () => {
      const tmpl = Template.create()
        .add({ dir: './tmpl-1', pattern: '*.ts' })
        .add({ dir: './tmpl-1', pattern: '*.ts' });
      expect(tmpl.sources).to.eql([{ dir: './tmpl-1', pattern: '*.ts' }]);
    });

    it('merges in another [tmpl]', () => {
      const tmpl1 = Template.create({ dir: './tmpl-1' });
      const tmpl2 = Template.create([{ dir: './tmpl-2' }, { dir: './tmpl-3' }]);
      const res = tmpl1.add(tmpl2);
      expect(res.sources).to.eql([
        { dir: './tmpl-1' },
        { dir: './tmpl-2' },
        { dir: './tmpl-3' },
      ]);
    });

    it('merges multiple [tmpl]\'s', () => {
      const tmpl1 = Template.create({ dir: './tmpl-1' });
      const tmpl2 = Template.create(['./tmpl-2', './tmpl-4']);
      const tmpl3 = Template.create().add('./tmpl-3');
      const tmpl4 = Template.create().add('./tmpl-4');
      const res = tmpl1.add([tmpl2, tmpl3, tmpl3, tmpl1, tmpl4]);

      // NB: Added multiple times and de-duped.
      expect(res.sources).to.eql([
        { dir: './tmpl-1' },
        { dir: './tmpl-2' },
        { dir: './tmpl-4' },
        { dir: './tmpl-3' },
      ]);
    });
  });

  describe('files', () => {
    it('has no files (dir does not exist)', async () => {
      const tmpl = Template.create({
        dir: './NO_EXIST',
        pattern: '**',
      });
      const files = await tmpl.files();
      expect(files.length).to.eql(0);
    });

    it('has no files (file does not exist)', async () => {
      const tmpl = Template.create({
        dir: './example/tmpl-1',
        pattern: 'NO_EXIST.md',
      });
      const files = await tmpl.files();
      expect(files.length).to.eql(0);
    });

    it('has no files (empty dir)', async () => {
      const tmpl = Template.create({
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
      const tmpl = Template.create(source);
      const files = await tmpl.files();
      const file = files[0];

      expect(files.length).to.eql(1);
      expect(file.source).to.eql(source);
      expect(file.base).to.eql(fsPath.resolve(source.dir));
      expect(file.path).to.eql('/README.md');
    });

    it('has multiple files ("**" glob pattern by default)', async () => {
      const tmpl = Template.create({ dir: './example/tmpl-1' });
      const files = await tmpl.files();
      const paths = files.map(f => f.path);
      expect(paths).to.include('/.babelrc');
      expect(paths).to.include('/.gitignore');
      expect(paths).to.include('/README.md');
      expect(paths).to.include('/images/face.svg');
      expect(paths).to.include('/src/index.ts');
    });

    it('filter pattern (.ts file only)', async () => {
      const tmpl = Template.create({
        dir: './example/tmpl-1',
        pattern: '**/*.ts',
      });
      const files = await tmpl.files();
      const paths = files.map(f => f.path);
      expect(paths).to.eql(['/index.ts', '/src/index.ts']);
    });

    it('caches results', async () => {
      const tmpl = Template.create({ dir: './example/tmpl-1' });
      const files1 = await tmpl.files();
      const files2 = await tmpl.files();
      expect(files1).to.equal(files2);
    });

    it('forces new results (override cache)', async () => {
      const tmpl = Template.create({ dir: './example/tmpl-1' });
      const files1 = await tmpl.files();
      const files2 = await tmpl.files({ cache: false });
      expect(files1).to.not.equal(files2);
    });

    it('override file', async () => {
      const tmpl = Template.create()
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

  describe('filter', () => {
    it('adds as a new instance', () => {
      const tmpl1 = Template.create({ dir: './tmpl-1' });
      const tmpl2 = tmpl1.filter(file => true);
      expect(tmpl1).to.not.equal(tmpl2);
    });

    it('applies filter', async () => {
      const tmpl1 = Template.create({ dir: './example/tmpl-2' });
      const tmpl2 = tmpl1.filter(f => f.path.endsWith('.js'));
      const files1 = await tmpl1.files();
      const files2 = await tmpl2.files();
      expect(files1.length).to.eql(3);
      expect(files2.length).to.eql(1);
    });
  });

  describe('processors', () => {
    it('adds as a new instance', () => {
      const tmpl1 = Template.create({ dir: './tmpl-1' });
      const tmpl2 = tmpl1.process((req, res) => true);
      expect(tmpl1).to.not.equal(tmpl2);
    });

    it('change => write', async () => {
      // let text
      type IMyVariables = { greeting: string };
      const dir = fsPath.resolve(TEST_DIR);
      const tmpl = Template.create({ dir: './example/tmpl-2' })
        .process<IMyVariables>((req, res) => {
          if (!req.isBinary) {
            expect(typeof req.text).to.eql('string');
          }
          if (req.isBinary) {
            expect(req.text).to.eql(undefined);
          }

          res.replaceText(/__GREETING__/g, req.variables.greeting);
          res.next();
        })
        .process(async (req, res) => {
          const path = fsPath.join(dir, req.path);
          await fs.ensureDir(dir);
          await fs.writeFile(path, req.buffer);
          res.complete();
        });

      await tmpl.execute<IMyVariables>({ variables: { greeting: 'Hello!' } });

      const file = {
        indexJs: await fs.readFile(fsPath.join(dir, 'index.js'), 'utf8'),
        readme: await fs.readFile(fsPath.join(dir, 'README.md'), 'utf8'),
      };
      const isBlueprintBinary = await isBinaryFile(
        fsPath.join(dir, 'blueprint.png'),
      );
      expect(file.indexJs).to.include(`console.log('Hello!');`);
      expect(file.readme).to.include(`# tmpl-2`);
      expect(isBlueprintBinary).to.eql(true);
    });
  });
});
