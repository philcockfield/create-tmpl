/**
 * The source location of template file(s).
 */
export type ITemplateSource = {
  dir: string;
  pattern?: string; // Glob pattern.
};

/**
 * Represents a single template file.
 */
export type ITemplateFile = {
  base: string;
  path: string;
  isBinary: boolean;
};

/**
 * Represents a set of custom values passed in to a template.
 */
export type IVariables = { [key: string]: any };

/**
 * Filter.
 */
export type TemplateFilter = (file: ITemplateFile) => boolean;

/**
 * Processor.
 */
export type TemplateProcessor<V extends IVariables = {}> = (
  req: IProcessTemplateRequest<V>,
  res: IProcessTemplateResponse,
) => any | Promise<any>;
export type TemplatePathFilter = RegExp;

/**
 * Processor: Request
 */
export type IProcessTemplateRequest<V extends IVariables = {}> = {
  path: string;
  buffer: Buffer;
  text?: string;
  isBinary: boolean;
  variables: V;
};

/**
 * Processor: Response
 */
export type IProcessTemplateResponse = {
  text: string | undefined;
  replaceText: ReplaceTemplateText;
  next: () => void;
  complete: () => void;
};

// NB: Taken from the [lib.dom.d.ts] types.
export type ReplaceTemplateText = (
  searchValue: {
    [Symbol.replace](string: string, replaceValue: string): string;
  },
  replaceValue: string,
) => IProcessTemplateResponse;
