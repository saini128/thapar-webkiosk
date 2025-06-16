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
export function validateSessionId(request) {
  const sessionId = request.headers.get('X-Session-ID');
  
  if (!sessionId) {
    console.error('Error: X-Session-ID header missing from dashboard request.');
    return null;
  }
  
  return sessionId;
}