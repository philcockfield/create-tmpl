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
  source: ITemplateSource;
  base: string;
  path: string;
  isBinary: boolean;
};

/**
 * Represents a set of custom values passed in to a template.
 */
export type ITemplateVariables = { [key: string]: any };

/**
 * Filter.
 */
export type TemplateFilter = (file: ITemplateFile) => boolean;

/**
 * Processor.
 */
export type TemplateProcessor<V extends ITemplateVariables = {}> = (
  req: IProcessTemplateRequest<V>,
  res: IProcessTemplateResponse,
) => any | Promise<any>;

export type IProcessTemplateRequest<V extends ITemplateVariables = {}> = {
  path: string;
  buffer: Buffer;
  text?: string;
  isBinary: boolean;
  variables: V;
};

export type IProcessTemplateResponse = {
  text: (text: string) => IProcessTemplateResponse;
  replaceText: (
    searchValue: {
      [Symbol.replace](string: string, replaceValue: string): string;
    },
    replaceValue: string,
  ) => IProcessTemplateResponse;
  next: () => void;
  complete: () => void;
};
