import { jwtVerify, SignJWT } from 'jose';

const encoder = new TextEncoder();
const JWT_SECRET = process.env.JWT_SECRET;

// Generate a JWT (same as jwt.sign)
export async function generateJWT(payload, expiresInSeconds = 60 * 60 * 24 * 100) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(encoder.encode(JWT_SECRET));
}

// Verify a JWT (Edge-compatible)
export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    return payload;
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return null;
  }
}
