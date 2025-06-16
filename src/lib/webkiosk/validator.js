import { VALIDATION_KEYWORDS, ERROR_INDICATORS } from './constants.js';

/**
 * Validate HTML content for specific URL
 * @param {string} url - The WebKiosk URL
 * @param {string} htmlContent - Raw HTML content
 * @returns {Object} Validation result with status and error details
 */
export function validateHTMLContent(url, htmlContent) {
  if (!htmlContent || htmlContent.trim().length === 0) {
    return {
      isValid: false,
      errorType: 'EMPTY_RESPONSE',
      errorMessage: 'Empty or null HTML content received'
    };
  }

  // Check for common error indicators first
  const errorCheck = checkForErrors(htmlContent);
  if (errorCheck.hasError) {
    return {
      isValid: false,
      errorType: errorCheck.errorType,
      errorMessage: errorCheck.errorMessage
    };
  }

  // Check for required keywords for this URL
  const keywordCheck = checkRequiredKeywords(url, htmlContent);
  if (!keywordCheck.isValid) {
    return {
      isValid: false,
      errorType: 'INVALID_CONTENT',
      errorMessage: keywordCheck.errorMessage
    };
  }

  return {
    isValid: true,
    errorType: null,
    errorMessage: null
  };
}

/**
 * Check for error indicators in HTML content
 * @param {string} htmlContent - Raw HTML content
 * @returns {Object} Error check result
 */
function checkForErrors(htmlContent) {
  const lowerContent = htmlContent.toLowerCase();

  // Check for session timeout
  for (const indicator of ERROR_INDICATORS.SESSION_TIMEOUT) {
    if (lowerContent.includes(indicator.toLowerCase())) {
      return {
        hasError: true,
        errorType: 'SESSION_TIMEOUT',
        errorMessage: 'Session has timed out. Please login again.'
      };
    }
  }

  // Check for access denied
  for (const indicator of ERROR_INDICATORS.ACCESS_DENIED) {
    if (lowerContent.includes(indicator.toLowerCase())) {
      return {
        hasError: true,
        errorType: 'ACCESS_DENIED',
        errorMessage: 'Access denied. Insufficient permissions.'
      };
    }
  }

  // Check for server errors
  for (const indicator of ERROR_INDICATORS.SERVER_ERROR) {
    if (lowerContent.includes(indicator.toLowerCase())) {
      return {
        hasError: true,
        errorType: 'SERVER_ERROR',
        errorMessage: 'Server error occurred while processing the request.'
      };
    }
  }

  // Check for invalid request
  for (const indicator of ERROR_INDICATORS.INVALID_REQUEST) {
    if (lowerContent.includes(indicator.toLowerCase())) {
      return {
        hasError: true,
        errorType: 'INVALID_REQUEST',
        errorMessage: 'Invalid request format or parameters.'
      };
    }
  }

  return {
    hasError: false,
    errorType: null,
    errorMessage: null
  };
}

/**
 * Check if HTML content contains required keywords for the URL
 * @param {string} url - The WebKiosk URL
 * @param {string} htmlContent - Raw HTML content
 * @returns {Object} Keyword validation result
 */
function checkRequiredKeywords(url, htmlContent) {
  const requiredKeywords = VALIDATION_KEYWORDS[url];
  
  if (!requiredKeywords || requiredKeywords.length === 0) {
    console.warn(`No validation keywords defined for URL: ${url}`);
    return {
      isValid: true,
      errorMessage: null
    };
  }

  const lowerContent = htmlContent.toLowerCase();
  
  // Check if at least one required keyword is present
  const hasRequiredKeyword = requiredKeywords.some(keyword => 
    lowerContent.includes(keyword.toLowerCase())
  );

  if (!hasRequiredKeyword) {
    return {
      isValid: false,
      errorMessage: `Response does not contain expected content keywords: ${requiredKeywords.join(', ')}`
    };
  }

  return {
    isValid: true,
    errorMessage: null
  };
}