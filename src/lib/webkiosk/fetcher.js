import { REQUEST_HEADERS, REQUEST_TIMEOUT } from './constants.js';
import { validateHTMLContent } from './validator.js';

/**
 * Create a fetch request with timeout
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Fetch promise with timeout
 */
function fetchWithTimeout(url, options, timeout) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

export async function fetchWebKioskPage(url, sessionId) {
  console.log(`--- Fetching ${url} ---`);
  
  try {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        ...REQUEST_HEADERS,
        'Cookie': `JSESSIONID=${sessionId}`,
      },
      redirect: 'follow',
    }, REQUEST_TIMEOUT);

    const status = response.status;
    const statusText = response.statusText;

    // Always get the response text, regardless of status
    const htmlContent = await response.text();
    
   
      const validation = validateHTMLContent(url, htmlContent);
      
      if (!validation.isValid) {
        console.warn(`Content validation failed for ${url}: ${validation.errorMessage}`);
        return {
          status,
          statusText,
          success: false,
          htmlContent,
          errorMessage: validation.errorMessage,
          errorType: validation.errorType,
          validationFailed: true
        };
      }
      
      return {
        status,
        statusText,
        success: true,
        htmlContent,
        errorMessage: null,
        errorType: null,
        validationFailed: false
      };
    // } else {
    //   // For non-2xx responses, still validate to check for specific errors
    //   const validation = validateHTMLContent(url, htmlContent);
    //   const errorMessage = validation.errorMessage || `HTTP ${status}: ${statusText}`;
      
    //   console.error(`Failed to fetch ${url}. Status: ${status} ${statusText}`);
    //   console.error(`Error Response Body for ${url}:`, htmlContent.substring(0, 500) + (htmlContent.length > 500 ? '...' : ''));
      
    //   return {
    //     status,
    //     statusText,
    //     success: false,
    //     htmlContent,
    //     errorMessage,
    //     errorType: validation.errorType || 'HTTP_ERROR',
    //     validationFailed: false
    //   };
    // }
  } catch (error) {
    let errorType = 'NETWORK_ERROR';
    let errorMessage = `Network error fetching ${url}: ${error.message}`;
    
    // Specific error types
    if (error.message === 'Request timeout') {
      errorType = 'TIMEOUT';
      errorMessage = `Request to ${url} timed out after ${REQUEST_TIMEOUT}ms`;
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorType = 'CONNECTION_ERROR';
      errorMessage = `Unable to connect to ${url}. Server may be unreachable.`;
    }
    
    console.error(errorMessage, error);
    
    return {
      status: 0,
      statusText: 'Network Error',
      success: false,
      htmlContent: '',
      errorMessage,
      errorType,
      validationFailed: false
    };
  }
}