#!/usr/bin/env node
import * as yargs from 'yargs';
import { log } from '../common';

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them. In the future, promise rejections that are not handled will
 * terminate the Node.js process with a non-zero exit code.
 */
process.on('unhandledRejection', err => {
  throw err;
});

const COMMAND = {
  INIT: 'init',
};
const COMMANDS = Object.keys(COMMAND).map(key => COMMAND[key]);

/**
 * Cheat sheet.
 * https://devhints.io/yargs
 */
const program = yargs
  .usage(`Usage: ${log.magenta('$0')} ${log.cyan('<command>')} [options]`)

  /**
   * `init`
   */
  .command(
    log.cyan(COMMAND.INIT),
    'Initialize the module with default files.',
    e =>
      e.option('force', {
        alias: 'f',
        describe: 'Overwrite existing files.',
        boolean: true,
      }),
    e => {
      // const { force, reset } = e;
      log.info('INIT', e);
      return;
    },
  )

  .help('h')
  .alias('h', 'help')
  .alias('v', 'version');

/**
 * Show full list of commands if none was provided.
 */
if (!COMMANDS.includes(program.argv._[0])) {
  program.showHelp();
  log.info();
  process.exit(0);
}

log.info();
