import { NextResponse } from 'next/server';
import { WEBKIOSK_URLS } from '../../../lib/webkiosk/constants.js';
import { fetchWebKioskPage } from '../../../lib/webkiosk/fetcher.js';
import { parseWebKioskHTML } from '../../../lib/webkiosk/parsers/index.js';
import { createSuccessResponse, createErrorResponse, validateSessionId } from '../../../lib/utils/response.js';
import { storeOrUpdateDashboard, getDashboard } from '@/lib/db/update_data.js';
export async function GET(request) {
  // ✅ Validate session ID and handle refresh
  const session = await validateSessionId(request);

  if (!session) {
    return NextResponse.json(
      createErrorResponse('Session ID is required to fetch WebKiosk data. Please log in first.'),
      { status: 401 }
    );
  }

  const { sessionId, refreshed, responseHeaders, enrollmentNo } = session;
  // Get all URLs to fetch
  const urlsToFetch = Object.values(WEBKIOSK_URLS);
  var results = await getDashboard(enrollmentNo);
  if (!results ||results.data===null) {
    const postResponse = await POST(request);
    return postResponse;
  } else {
      results=results.data;
  }
  const errors = [];
    
  const responseMessage = 'All dashboard data fetched and parsed successfully';

  const response = NextResponse.json(
    createSuccessResponse(
      {
        enrollmentNo: enrollmentNo,
        results: results,
        summary: {
          total: urlsToFetch.length,
          successful: urlsToFetch.length,
          failed: errors.length,
          errors: errors
        }
      },
      responseMessage,
    ),
    { status: 200 }
  );

  // ✅ Attach refreshed cookie headers if applicable
  if (refreshed && responseHeaders) {
    responseHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }
  console.log(`Session ID: ${sessionId}, Refreshed: ${refreshed}, Enrollment No: ${enrollmentNo}`);

  return response;
}

export async function POST(request) {
  // ✅ Validate session ID and handle refresh
  const session = await validateSessionId(request);

  if (!session) {
    return NextResponse.json(
      createErrorResponse('Session ID is required to fetch WebKiosk data. Please log in first.'),
      { status: 401 }
    );
  }

  const { sessionId, refreshed, responseHeaders, enrollmentNo } = session;
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
      parsedData = parseWebKioskHTML(url, fetchResult.htmlContent);
    }

    if (fetchResult.errorType === 'SESSION_TIMEOUT') {
      hasSessionTimeout = true;
    }

    if (!fetchResult.success) {
      errors.push({
        url,
        errorType: fetchResult.errorType,
        errorMessage: fetchResult.errorMessage
      });
    }

    results[url] = {
      fetch: {
        status: fetchResult.status,
        statusText: fetchResult.statusText,
        success: fetchResult.success,
        errorMessage: fetchResult.errorMessage,
        errorType: fetchResult.errorType,
        validationFailed: fetchResult.validationFailed || false
      },
      parsed: parsedData
    };
  }

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

  const successfulRequests = Object.values(results).filter(result => result.fetch.success);
  const hasSuccessfulRequests = successfulRequests.length > 0;

  if (!hasSuccessfulRequests) {
    let statusCode = 502;

    if (errors.some(e => e.errorType === 'TIMEOUT')) {
      statusCode = 504;
    } else if (errors.some(e => e.errorType === 'CONNECTION_ERROR')) {
      statusCode = 503;
    } else if (errors.some(e => e.errorType === 'ACCESS_DENIED')) {
      statusCode = 403;
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

  const responseMessage = successfulRequests.length === urlsToFetch.length
    ? 'All dashboard data fetched and parsed successfully'
    : `Partial success: ${successfulRequests.length}/${urlsToFetch.length} requests completed successfully`;

  if (urlsToFetch.length === successfulRequests.length) {
    storeOrUpdateDashboard(enrollmentNo, results);
  }
  const response = NextResponse.json(
    createSuccessResponse(
      {
        enrollmentNo: enrollmentNo,
        results: results,
        summary: {
          total: urlsToFetch.length,
          successful: successfulRequests.length,
          failed: errors.length,
          errors: errors
        }
      },
      responseMessage,
    ),
    { status: 200 }
  );

  // ✅ Attach refreshed cookie headers if applicable
  if (refreshed && responseHeaders) {
    responseHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }
  console.log(`Session ID: ${sessionId}, Refreshed: ${refreshed}, Enrollment No: ${enrollmentNo}`);

  return response;
}
