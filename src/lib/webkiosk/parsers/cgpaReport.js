import {load} from 'cheerio';

/**
 * Parse CGPA report from WebKiosk HTML
 * @param {string} htmlContent - Raw HTML content from StudCGPAReport.jsp
 * @returns {Object} Parsed CGPA report data
 */
export function parseCGPAReport(htmlContent) {
  console.log('Parsing CGPA report HTML...');

  try {
    const $ = load(htmlContent);

    const table = $('#table-1 tbody');
    if (!table.length) {
      return {
        parsed: false,
        data: [],
        error: 'CGPA table not found in HTML'
      };
    }

    const rows = table.find('tr');
    if (!rows.length) {
      return {
        parsed: true,
        data: [],
        error: 'No CGPA records found'
      };
    }

    const result = [];

    rows.each((_, row) => {
      const cols = $(row).find('td');

      if (cols.length < 6) return; // Skip malformed rows

      const getText = (col) => $(col).text().replace(/\u00a0/g, ' ').trim();
      const parseNumber = (val) => {
        const num = parseFloat(val.replace(/[^\d.]/g, ''));
        return isNaN(num) ? null : num;
      };

      result.push({
        examCode: getText(cols[0]) || null,
        courseCredit: parseNumber(getText(cols[1])),
        earnedCredit: parseNumber(getText(cols[2])),
        pointsSecured: parseNumber(getText(cols[3])),
        sgpa: parseNumber(getText(cols[4])),
        cgpa: parseNumber(getText(cols[5]))
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
