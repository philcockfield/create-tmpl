import { inquirer } from '../libs';
import { IPrompt } from './types';

/**
 * Prompts from a list of options.
 */
export async function forOption<T extends IPrompt>(
  title: string,
  options: T[],
) {
  const choices = options.map(({ label, id }) => ({
    name: label,
    value: id,
  }));
  const confirm = {
    type: 'list',
    name: 'id',
    message: title,
    choices,
  };
  const { id } = (await inquirer.prompt(confirm)) as { id: string };
  const result = options.find(item => item.id === id);
  return result;
}

/**
 * Prompts for a text value.
 */
export async function forText(message: string) {
  message = message.replace(/\.$/, '');
  if (!message.endsWith('?')) {
    message += ':';
  }
  const confirm = {
    type: 'input',
    name: 'value',
    message: message,
  };
  const { value } = (await inquirer.prompt(confirm)) as { value: string };
  return value;
}
