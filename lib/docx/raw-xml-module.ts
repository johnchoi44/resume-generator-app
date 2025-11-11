/**
 * Custom docxtemplater module for injecting raw XML
 * This module allows us to inject formatted text runs directly into the document
 */

import { parseMarkdownToRuns } from './text-formatter';

/**
 * Creates Word XML for a text run with optional formatting
 */
function createTextRunXML(text: string, bold?: boolean, italic?: boolean): string {
  const properties = [];

  if (bold) {
    properties.push('<w:b/><w:bCs/>');
  }

  if (italic) {
    properties.push('<w:i/><w:iCs/>');
  }

  const propsXML = properties.length > 0
    ? `<w:rPr>${properties.join('')}</w:rPr>`
    : '';

  // Escape XML special characters
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  return `<w:r>${propsXML}<w:t xml:space="preserve">${escapedText}</w:t></w:r>`;
}

/**
 * Docxtemplater module for raw XML injection with markdown support
 */
export class RawXMLModule {
  name = 'RawXMLModule';

  optionsTransformer(options: any, docxtemplater: any) {
    // Make the module aware of the @ prefix
    return options;
  }

  parse(placeHolderContent: string) {
    // Handle @rawxml: prefix for raw XML injection
    if (placeHolderContent.startsWith('@rawxml:')) {
      return {
        type: 'placeholder',
        value: placeHolderContent.slice(8), // Remove '@rawxml:' prefix
        module: this.name,
        inverted: false,
      };
    }
    return null;
  }

  postparse(parsed: any[]) {
    return parsed.map((part: any) => {
      if (part.type === 'placeholder' && part.value.startsWith('@')) {
        // This is a raw XML placeholder
        return {
          ...part,
          module: this.name,
          value: part.value.slice(1), // Remove @ prefix
        };
      }
      return part;
    });
  }

  render(part: any, options: any) {
    if (part.module !== this.name) {
      return null;
    }

    // Get the value from the scope
    const value = options.scopeManager.getValue(part.value, { part });

    if (!value) {
      return { value: '', errors: [] };
    }

    // If it's already XML string, return it
    if (typeof value === 'string') {
      const runs = parseMarkdownToRuns(value);
      const xml = runs.map(run =>
        createTextRunXML(run.text, run.bold, run.italic)
      ).join('');

      return {
        value: xml,
        errors: []
      };
    }

    return { value: String(value), errors: [] };
  }

  resolve(part: any, options: any) {
    if (part.module !== this.name) {
      return null;
    }
    return part;
  }

  postrender(postRendered: any, options: any) {
    // No post-processing needed
    return postRendered;
  }

  getFileType() {
    return 'docx';
  }
}
