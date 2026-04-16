import { SignJWT, jwtVerify } from 'jose';

let secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not set in production. Refusing to start session manager.');
  } else {
    console.warn('WARNING: Using default JWT_SECRET for development. DO NOT USE IN PRODUCTION.');
    secretKey = 'default_secret_key_for_development_only_change_in_production';
  }
}

const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
