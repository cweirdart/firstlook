import { v4 as uuidv4 } from 'uuid';

export function generateId() {
  return uuidv4();
}

/**
 * Generate a short, human-friendly share code (6 chars).
 */
export function generateShareCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let code = '';
  const array = crypto.getRandomValues(new Uint8Array(6));
  for (const byte of array) {
    code += chars[byte % chars.length];
  }
  return code;
}
