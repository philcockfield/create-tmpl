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
 * Filter.
 */
export type TemplateFilter = (file: ITemplateFile) => boolean;

/**
 * Processor.
 */
export type TemplateProcessor = (
  req: IProcessRequest,
  res: IProcessResponse,
) => any | Promise<any>;

export type IProcessRequest = {
  path: string;
  buffer: Buffer;
  text?: string;
};
export type IProcessResponse = {
  text: (text: string) => IProcessResponse;
  replaceText: (
    searchValue: {
      [Symbol.replace](string: string, replaceValue: string): string;
    },
    replaceValue: string,
  ) => IProcessResponse;
  next: () => void;
  complete: () => void;
};
