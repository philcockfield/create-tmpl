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
};

/**
 * EVENTS
 */
export type ITemplateEvent = ITemplateBeforeWriteFile | ITemplateAfterWriteFile;

export type ITemplateBeforeWriteFile = {
  type: 'WRITE_FILE/BEFORE';
  payload: { file: ITemplateFile };
};

export type ITemplateAfterWriteFile = {
  type: 'WRITE_FILE/AFTER';
  payload: { file: ITemplateFile };
};
