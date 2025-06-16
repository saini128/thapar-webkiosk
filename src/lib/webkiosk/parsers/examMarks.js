import {load} from 'cheerio';

/**
 * Parse exam marks from WebKiosk HTML
 * @param {string} htmlContent - Raw HTML content from StudentEventMarksView.jsp
 * @returns {Object} Parsed exam marks data
 */
export function parseExamMarks(htmlContent) {
  try {
    const $ = load(htmlContent);

    const table = $('#table-1 tbody');
    if (!table.length) {
      return {
        parsed: false,
        data: [],
        error: 'Marks table not found in HTML'
      };
    }

    const rows = table.find('tr');
    if (!rows.length) {
      return {
        parsed: true,
        data: [],
        error: 'No exam data available'
      };
    }

    const result = [];

    rows.each((_, row) => {
      const cols = $(row).find('td');

      // Ignore rows with too few columns (malformed rows)
      if (cols.length < 9) return;

      const getText = (col) => $(col).text().replace(/\u00a0/g, ' ').trim();
      const parseNumber = (val) => {
        const num = parseFloat(val.replace(/[^\d.]/g, ''));
        return isNaN(num) ? null : num;
      };

      result.push({
        srNo: getText(cols[0]).replace(/\.$/, '') || null,
        examCode: getText(cols[1]) || null,
        subject: getText(cols[2]) || null,
        event: getText(cols[3]) || null,
        fullMarks: parseNumber(getText(cols[4])),
        obtainedMarks: parseNumber(getText(cols[5])),
        weightage: parseNumber(getText(cols[6])),
        effectiveMarks: parseNumber(getText(cols[7])),
        status: getText(cols[8]) || null
      });
    });

    return {
      parsed: true,
      data: result,
      error: null
    };
  } catch (err) {
    return {
      parsed: false,
      data: [],
      error: `Unexpected error while parsing: ${err.message}`
    };
  }
}
