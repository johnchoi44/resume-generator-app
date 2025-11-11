/**
 * Text Formatter for DOCX Generation
 * Converts markdown-style formatting to docxtemplater-compatible format
 */

export interface TextRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

/**
 * Parse markdown-style formatting and convert to text runs
 * Supports:
 * - **bold**
 * - *italic*
 * - ***bold and italic***
 *
 * @param text - Text with markdown formatting
 * @returns Array of text runs with formatting information
 */
export function parseMarkdownToRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let currentIndex = 0;

  // Regex to match markdown formatting
  // Matches: ***text***, **text**, *text*
  const markdownRegex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;

  let match;

  while ((match = markdownRegex.exec(text)) !== null) {
    // Add plain text before the match
    if (match.index > currentIndex) {
      const plainText = text.substring(currentIndex, match.index);
      if (plainText) {
        runs.push({ text: plainText });
      }
    }

    // Determine formatting and text content
    if (match[1].startsWith('***')) {
      // Bold and italic
      runs.push({
        text: match[2],
        bold: true,
        italic: true
      });
    } else if (match[1].startsWith('**')) {
      // Bold only
      runs.push({
        text: match[3],
        bold: true
      });
    } else if (match[1].startsWith('*')) {
      // Italic only
      runs.push({
        text: match[4],
        italic: true
      });
    }

    currentIndex = match.index + match[0].length;
  }

  // Add remaining plain text
  if (currentIndex < text.length) {
    const remainingText = text.substring(currentIndex);
    if (remainingText) {
      runs.push({ text: remainingText });
    }
  }

  // If no markdown was found, return the whole text as a single run
  if (runs.length === 0) {
    runs.push({ text });
  }

  return runs;
}

/**
 * Convert a description array to formatted text runs
 *
 * @param descriptions - Array of description strings with markdown
 * @returns Array of formatted text runs
 */
export function formatDescriptions(descriptions: string[]): TextRun[][] {
  return descriptions.map(desc => parseMarkdownToRuns(desc));
}

/**
 * Simple helper to convert text runs back to plain text (for testing/debugging)
 */
export function textRunsToPlainText(runs: TextRun[]): string {
  return runs.map(run => run.text).join('');
}

/**
 * Convert text runs to docxtemplater-compatible format
 * This creates an object that can be used with custom rendering in docxtemplater
 */
export function textRunsToDocxFormat(runs: TextRun[]): any[] {
  return runs.map(run => ({
    text: run.text,
    formatting: {
      bold: run.bold || false,
      italic: run.italic || false
    }
  }));
}
