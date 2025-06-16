import { parsePersonalInfo } from './personalInfo.js';
import { parseExamMarks } from './examMarks.js';
import { parseExamGrades } from './examGrades.js';
import { parseCGPAReport } from './cgpaReport.js';
import { WEBKIOSK_URLS } from '../constants.js';

/**
 * Parse HTML content based on the URL type
 * @param {string} url - The WebKiosk URL that was fetched
 * @param {string} htmlContent - Raw HTML content
 * @returns {Object} Parsed data with structure based on URL type
 */
export function parseWebKioskHTML(url, htmlContent) {
  try {
    switch (url) {
      case WEBKIOSK_URLS.PERSONAL_INFO:
        return parsePersonalInfo(htmlContent);
      
      case WEBKIOSK_URLS.EXAM_MARKS:
        return parseExamMarks(htmlContent);
      
      case WEBKIOSK_URLS.EXAM_GRADES:
        return parseExamGrades(htmlContent);
      
      case WEBKIOSK_URLS.CGPA_REPORT:
        return parseCGPAReport(htmlContent);
      
      default:
        console.warn(`No parser found for URL: ${url}`);
        return {
          parsed: false,
          data: null,
          error: `No parser available for URL: ${url}`
        };
    }
  } catch (error) {
    console.error(`Error parsing HTML for ${url}:`, error);
    return {
      parsed: false,
      data: null,
      error: `Parsing error: ${error.message}`
    };
  }
}

// Export individual parsers for direct use if needed
export { parsePersonalInfo, parseExamMarks, parseExamGrades, parseCGPAReport };