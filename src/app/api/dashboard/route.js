import { NextResponse } from 'next/server';
import { WEBKIOSK_URLS } from '../../../lib/webkiosk/constants.js';
import { fetchWebKioskPage } from '../../../lib/webkiosk/fetcher.js';
import { parseWebKioskHTML } from '../../../lib/webkiosk/parsers/index.js';
import { createSuccessResponse, createErrorResponse, validateSessionId } from '../../../lib/utils/response.js';

export async function GET(request) {
  // Validate session ID
  const sessionId = validateSessionId(request);
  if (!sessionId) {
    return NextResponse.json(
      createErrorResponse('Session ID is required to fetch WebKiosk data. Please log in first.'),
      { status: 401 }
    );
  }

  // Get all URLs to fetch
  const urlsToFetch = Object.values(WEBKIOSK_URLS);
  const results = {};
  const errors = [];
  let hasSessionTimeout = false;

  // Fetch and parse each URL
  for (const url of urlsToFetch) {
    const fetchResult = await fetchWebKioskPage(url, sessionId);
    
    let parsedData = null;
    if (fetchResult.success && fetchResult.htmlContent) {
      // Parse the HTML content only if fetch was successful and validated
      parsedData = parseWebKioskHTML(url, fetchResult.htmlContent);
    }

    // Check for session timeout
    if (fetchResult.errorType === 'SESSION_TIMEOUT') {
      hasSessionTimeout = true;
    }

    // Collect errors for summary
    if (!fetchResult.success) {
      errors.push({
        url,
        errorType: fetchResult.errorType,
        errorMessage: fetchResult.errorMessage
      });
    }

    // Store complete result
    results[url] = {
      fetch: {
        status: fetchResult.status,
        statusText: fetchResult.statusText,
        success: fetchResult.success,
        errorMessage: fetchResult.errorMessage,
        errorType: fetchResult.errorType,
        validationFailed: fetchResult.validationFailed || false
      },
      parsed: parsedData,
      // Keep raw HTML for debugging (you can remove this in production)
    //   rawHtml: fetchResult.success ? fetchResult.htmlContent : null
    };
  }

  // Handle session timeout - should be treated as authentication error
  if (hasSessionTimeout) {
    return NextResponse.json(
      createErrorResponse(
        'Session has expired. Please login again to continue.',
        { 
          errorType: 'SESSION_TIMEOUT',
          results: results 
        }
      ),
      { status: 401 }
    );
  }

  // Check if any requests were successful
  const successfulRequests = Object.values(results).filter(result => result.fetch.success);
  const hasSuccessfulRequests = successfulRequests.length > 0;

  // If no requests were successful, return error response
  if (!hasSuccessfulRequests) {
    // Determine appropriate status code based on error types
    let statusCode = 502; // Default: Bad Gateway
    
    if (errors.some(e => e.errorType === 'TIMEOUT')) {
      statusCode = 504; // Gateway Timeout
    } else if (errors.some(e => e.errorType === 'CONNECTION_ERROR')) {
      statusCode = 503; // Service Unavailable
    } else if (errors.some(e => e.errorType === 'ACCESS_DENIED')) {
      statusCode = 403; // Forbidden
    }

    return NextResponse.json(
      createErrorResponse(
        'Failed to fetch any WebKiosk data. Please check your connection and try again.',
        { 
          errors: errors,
          results: results
        }
      ),
      { status: statusCode }
    );
  }

  // Partial success - some requests failed but some succeeded
  const responseMessage = successfulRequests.length === urlsToFetch.length 
    ? 'All dashboard data fetched and parsed successfully'
    : `Partial success: ${successfulRequests.length}/${urlsToFetch.length} requests completed successfully`;

  return NextResponse.json(
    createSuccessResponse(
      {
        results: results,
        summary: {
          total: urlsToFetch.length,
          successful: successfulRequests.length,
          failed: errors.length,
          errors: errors
        }
      },
      responseMessage
    ),
    { status: 200 }
  );
}