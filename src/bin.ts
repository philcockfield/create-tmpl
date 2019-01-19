#!/usr/bin/env node
import * as yargs from 'yargs';
import { log } from './common';
log.info();

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them. In the future, promise rejections that are not handled will
 * terminate the Node.js process with a non-zero exit code.
 */
process.on('unhandledRejection', err => {
  throw err;
});

const CMD = {
  LIST: 'list',
};
const CMDS = Object.keys(CMD).map(key => CMD[key]);

/**
 * Cheat sheet.
 * https://devhints.io/yargs
 */
const SCRIPT = log.magenta('tmpl');
const COMMAND = log.cyan('<command>');
const OPTIONS = log.gray('[options]');
const program = yargs
  .scriptName(SCRIPT)
  .usage(`${'Usage:'} ${SCRIPT} ${COMMAND} ${OPTIONS}`)

  /**
   * `init`
   */
  .command(
    log.cyan(CMD.LIST),
    'Lists the available templates',
    e => e,
    // e.option('force', {
    //   alias: 'f',
    //   describe: 'Overwrite existing files.',
    //   boolean: true,
    // }),
    e => {
      // const { force, reset } = e;
      log.info('ls', e);
      return;
    },
  )
  .alias('ls', 'list')

  .help('h')
  .alias('h', 'help')
  .alias('v', 'version');

/**
 * Show full list of commands if none was provided.
 */
if (!CMDS.includes(program.argv._[0])) {
  program.showHelp();
  log.info();
  process.exit(0);
}

log.info();
