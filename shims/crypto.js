// Crypto shim for React Native
// Extends crypto-browserify with randomUUID support

const cryptoBrowserify = require('crypto-browserify');

// Implementation of randomUUID using crypto.getRandomValues
// (provided by react-native-get-random-values)
function randomUUID() {
  // Generate 16 random bytes
  const bytes = new Uint8Array(16);

  // Use the global crypto.getRandomValues if available (from react-native-get-random-values)
  if (
    typeof global !== 'undefined' &&
    global.crypto &&
    global.crypto.getRandomValues
  ) {
    global.crypto.getRandomValues(bytes);
  } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Fallback to Math.random (less secure, but works)
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  // Set version (4) and variant (RFC 4122) bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant RFC 4122

  // Convert to hex string with dashes
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Export crypto-browserify with randomUUID added
module.exports = {
  ...cryptoBrowserify,
  randomUUID
};
