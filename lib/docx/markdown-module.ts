/**
 * Custom docxtemplater module for handling markdown formatting in DOCX
 * Converts markdown-style formatting to Word XML runs
 */

import { parseMarkdownToRuns, TextRun } from './text-formatter';

interface ModuleOptions {
  centered?: boolean;
}

/**
 * Creates XML for a text run with optional formatting
 * Preserves template font properties (Times New Roman, 10pt)
 */
function createTextRunXML(run: TextRun): string {
  const properties = [];

  // Preserve template font family (Times New Roman)
  properties.push('<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>');

  // Disable spell checking (matches template)
  properties.push('<w:noProof/>');

  // Add bold/italic formatting as needed
  if (run.bold) {
    properties.push('<w:b/>');
  }

  if (run.italic) {
    properties.push('<w:i/>');
  }

  // Preserve template font size: 20 half-points = 10pt
  properties.push('<w:sz w:val="20"/>');
  properties.push('<w:szCs w:val="20"/>');

  const propsXML = `<w:rPr>${properties.join('')}</w:rPr>`;

  // Escape XML special characters
  const escapedText = run.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  return `<w:r>${propsXML}<w:t xml:space="preserve">${escapedText}</w:t></w:r>`;
}

/**
 * Docxtemplater module for markdown formatting
 */
export class MarkdownModule {
  name = 'MarkdownModule';

  constructor(options: ModuleOptions = {}) {
    // Store options if needed
  }

  /**
   * Called when parsing the template
   */
  parse(placeHolderContent: string) {
    // Only process tags that start with 'fmt:' or that contain markdown
    if (placeHolderContent.startsWith('fmt:')) {
      return {
        type: 'placeholder',
        value: placeHolderContent.slice(4), // Remove 'fmt:' prefix
        module: this.name,
      };
    }
    return null;
  }

  /**
   * Called when rendering the document
   */
  render(part: any, options: any) {
    if (part.module !== this.name) {
      return null;
    }

    // Get the value from the scope
    const value = options.scopeManager.getValue(part.value, { part });

    if (!value || typeof value !== 'string') {
      return { value: '', errors: [] };
    }

    // Parse markdown and convert to XML runs
    const runs = parseMarkdownToRuns(value);
    const xmlRuns = runs.map(run => createTextRunXML(run)).join('');

    return {
      value: xmlRuns,
      errors: [],
    };
  }

  /**
   * Called to resolve the output
   */
  resolve(part: any, options: any) {
    if (part.module !== this.name) {
      return null;
    }

    return part;
  }

  /**
   * Called after all parts are rendered
   */
  postparse(parsed: any[], options: any) {
    return parsed;
  }

  /**
   * Called to get the file type
   */
  getFileType() {
    return 'docx';
  }
}

/**
 * Helper to process all descriptions in resume data
 * Converts description arrays to use the fmt: prefix for formatting
 */
export function prepareFormattedData(data: any): any {
  const processDescriptions = (items: any[]) => {
    return items?.map((item: any) => {
      if (item.description && Array.isArray(item.description)) {
        return {
          ...item,
          // Create formatted versions of descriptions
          descriptionFormatted: item.description,
        };
      }
      return item;
    }) || [];
  };

  return {
    ...data,
    experiences: processDescriptions(data.experiences),
    projects: processDescriptions(data.projects),
  };
}
