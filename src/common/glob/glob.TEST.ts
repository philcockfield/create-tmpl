import { expect } from 'chai';
import { glob } from '.';
import { fsPath } from '../libs';

describe.only('glob', () => {
  it('finds several files', async () => {
    const pattern = `${__dirname}/glob*.ts`;
    const res = await glob.find(pattern);
    expect(res.length).to.eql(2);
    expect(res[0].endsWith('glob.TEST.ts')).to.eql(true);
    expect(res[1].endsWith('glob.ts')).to.eql(true);
  });

  it('returns no dot-files (default)', async () => {
    const pattern = fsPath.resolve('./example/tmpl-1/*');
    const res = await glob.find(pattern);
    const dotFiles = res
      .map(path => fsPath.basename(path))
      .filter(file => file.startsWith('.'));
    expect(dotFiles).to.eql([]);
  });

  it('returns dot-files', async () => {
    const pattern = fsPath.resolve('./example/tmpl-1/*');
    const res = await glob.find(pattern, { dot: true });
    const dotFiles = res
      .map(path => fsPath.basename(path))
      .filter(file => file.startsWith('.'));
    expect(dotFiles.includes('.babelrc')).to.eql(true);
    expect(dotFiles.includes('.gitignore')).to.eql(true);
  });

  it('returns only files (by default)', async () => {
    const pattern = fsPath.resolve('./example/tmpl-1/*');
    const res = await glob.find(pattern);
    const names = res.map(p => fsPath.basename(p));
    expect(names.includes('src')).to.not.eql(true);
  });

  it('returns only directories', async () => {
    const pattern = fsPath.resolve('./example/tmpl-1/*');
    const res = await glob.find(pattern, { type: 'DIRS' });
    const names = res.map(p => fsPath.basename(p));
    expect(names.includes('src')).to.eql(true);
  });
});
