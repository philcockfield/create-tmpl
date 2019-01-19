import { IProcessRequest } from '../types';

/**
 * A request that is passed to a processor.
 */
export class Request implements IProcessRequest {
  public readonly path: string;
  private readonly content: Buffer | string;

  constructor(args: { path: string; content: Buffer | string }) {
    this.path = args.path;
    this.content = args.content;
  }

  /**
   * The file content as a Buffer.
   */
  public get buffer() {
    return typeof this.content === 'string'
      ? Buffer.from(this.content)
      : this.content;
  }
}
