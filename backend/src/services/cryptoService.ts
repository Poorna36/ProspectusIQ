import crypto from 'crypto';

// The encryption key should ideally come from an environment variable (e.g., process.env.ENCRYPTION_KEY).
// For the hackathon demo, we provide a fallback 32-byte key.
const ALGORITHM = 'aes-256-gcm';
const RAW_KEY = process.env.ENCRYPTION_KEY || 'prospectusiq-aes-256-gcm-secret-key-12345';
// Ensure the key is exactly 32 bytes for AES-256
const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(RAW_KEY)).digest('base64').substring(0, 32);

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns the IV, Auth Tag, and Ciphertext combined in a single base64 string.
 */
export function encrypt(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(12); // Recommended 96-bit IV for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag().toString('base64');

  // Format: iv:authTag:encryptedText
  return `${iv.toString('base64')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a previously encrypted AES-256-GCM string.
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return encryptedData;

  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [ivStr, authTagStr, encryptedTextStr] = parts;
    const iv = Buffer.from(ivStr, 'base64');
    const authTag = Buffer.from(authTagStr, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedTextStr, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Decryption failed');
  }
}
