import crypto from 'crypto';

// The encryption key should ideally come from an environment variable (e.g., process.env.ENCRYPTION_KEY)
// Must be exactly 32 bytes (256 bits) for aes-256-cbc.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-must-be-32-byte'; 
// Pad or slice to ensure it's 32 bytes
const AES_KEY = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
const IV_LENGTH = 16; // For AES, this is always 16

export function encryptText(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptText(text: string): string {
  const textParts = text.split(':');
  const ivHex = textParts.shift();
  if (!ivHex) return text; // Not encrypted or missing IV
  
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.error("Failed to decrypt text:", err);
    return "Encrypted text unreadable.";
  }
}
