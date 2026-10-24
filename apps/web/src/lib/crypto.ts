import crypto from 'node:crypto';
import { env } from 'node:process';

const ALGORITHM = 'aes-256-gcm';
// Node accepts shorter tags unless told otherwise, which are easier to forge
const AUTH_TAG_LENGTH = 16;
const SECRET_KEY = env.ENCRYPTION_KEY || '';

if (SECRET_KEY.length < 32) {
  throw new Error('ENCRYPTION_KEY must be at least 32 characters long.');
}

const KEY = crypto.createHash('sha256').update(SECRET_KEY).digest();

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

const ENCRYPTED_FORMAT = /^[0-9a-f]{32}:[0-9a-f]{32}:[0-9a-f]+$/;

/**
 * Whether a value was produced by `encrypt`. Values stored before encryption
 * was introduced are plain text.
 */
export const isEncrypted = (text: string) => ENCRYPTED_FORMAT.test(text);

export const decrypt = (text: string): string => {
  const [ivHex, authTagHex, encryptedHex] = text.split(':');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted text format');
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(ivHex, 'hex'),
    { authTagLength: AUTH_TAG_LENGTH },
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
