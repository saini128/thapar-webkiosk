import {load} from 'cheerio';

/**
 * Parse exam grades from WebKiosk HTML
 * @param {string} htmlContent - Raw HTML content from StudentEventGradesView.jsp
 * @returns {Object} Parsed exam grades data
 */
export function parseExamGrades(htmlContent) {

  try {
    const $ = load(htmlContent);

    const table = $('#table-1 tbody');
    if (!table.length) {
      return {
        parsed: false,
        data: [],
        error: 'Grade table not found in HTML'
      };
    }

    const rows = table.find('tr');
    if (!rows.length) {
      return {
        parsed: true,
        data: [],
        error: 'No grade records found'
      };
    }

    const result = [];

    rows.each((_, row) => {
      const cols = $(row).find('td');

      if (cols.length < 5) return; // skip malformed rows

      const getText = (col) => $(col).text().replace(/\u00a0/g, ' ').trim();
      const parseNumber = (text) => {
        const clean = text.replace(/[^\d.]/g, '');
        const num = parseFloat(clean);
        return isNaN(num) ? null : num;
      };

      result.push({
        subject: getText(cols[0]) || null,
        examCode: getText(cols[1]) || null,
        marksObtained: parseNumber(getText(cols[2])),
        maxMarks: parseNumber(getText(cols[3])),
        grade: getText(cols[4]) || null
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
      error: `Unexpected error during parsing: ${err.message}`
    };
  }
}
