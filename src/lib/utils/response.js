import { verifyJWT } from '@/lib/utils/jwt';
import { getCreds } from '@/lib/db/store_creds';
/**
 * Create standardized success response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Formatted success response
 */
export function createSuccessResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create standardized error response
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @param {number} code - Error code
 * @returns {Object} Formatted error response
 */
export function createErrorResponse(message, details = null, code = null) {
  return {
    success: false,
    message,
    error: {
      code,
      details,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Validate session ID from request headers
 * @param {Request} request - Next.js request object
 * @returns {string|null} Session ID if valid, null otherwise
 */
export async function validateSessionId(request) {
  const token = request.cookies.get('auth-token')?.value || null;
  const sessionId = request.cookies.get('X-Session-ID')?.value || null;
  console.log('Validating session ID:', sessionId);
  console.log('Auth token:', token);
  if (!token) {
    console.error('Missing auth-token JWT');
    return null;
  }

  const jwtData = await verifyJWT(token);
  if (!jwtData || !jwtData.enrollmentNo) {
    console.error('Invalid or expired auth-token');
    return null;
  }

  const enrollmentNo = jwtData.enrollmentNo;
  const sessionIssuedAt = request.cookies.get('X-Session-Issued-At')?.value;

  // If session ID is missing or too old → refresh
  const now = Date.now();
  const issuedTime = sessionIssuedAt ? parseInt(sessionIssuedAt, 10) : 0;
  const THIRTY_MINUTES = 30 * 60 * 1000;
  console.log('Session issued at:', issuedTime, 'Current time:', now, 'Threshold:', THIRTY_MINUTES);

  if (!sessionId || isNaN(issuedTime) || now - issuedTime > THIRTY_MINUTES) {
    console.log('Session ID expired or missing — refreshing from WebKiosk');

    const creds = await getCreds(enrollmentNo);
    if (!creds?.password) {
      console.error('Stored credentials not found for', enrollmentNo);
      return null;
    }

    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberCode: enrollmentNo, password: creds.password, _internal: true }),
    });

    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.sessionId) {
      console.error('WebKiosk re-login failed');
      return null;
    }

    // Return new session ID and headers to set cookies
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `X-Session-ID=${loginData.sessionId}; Path=/; Max-Age=1800; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );
    headers.append(
      'Set-Cookie',
      `X-Session-Issued-At=${Date.now()}; Path=/; Max-Age=1800; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );

    return {
      sessionId: loginData.sessionId,
      responseHeaders: headers,
      refreshed: true,
      enrollmentNo: enrollmentNo
    };
  }

  return {
    sessionId,
    responseHeaders: null,
    refreshed: false,
    enrollmentNo: enrollmentNo

  };
}
