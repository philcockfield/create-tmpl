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
  path: string;
};
