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
 * Write template.
 */
export type TemplateProcessor = (
  req: IProcessRequest,
  res: IProcessResponse,
) => void | Promise<void>;

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

/**
 * EVENTS
 */
// export type ITemplateEvent = IBeforeWriteFileEvent | IAfterWriteFileEvent;

// export type IBeforeWriteFileEvent = {
//   type: 'WRITE_FILE/BEFORE';
//   payload: {
//     file: ITemplateFile;
//     target: { dir: string };
//   };
// };

// export type IAfterWriteFileEvent = {
//   type: 'WRITE_FILE/AFTER';
//   payload: { file: ITemplateFile };
// };
