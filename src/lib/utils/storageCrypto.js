import CryptoJS from "crypto-js";

// Use a generic secret key (for obfuscation only — not high-security)
const SECRET_KEY = "generic_secret_for_obfuscation";

export function encrypt(data) {
  const jsonData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
}

export function decrypt(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.warn("Decryption failed", e);
    return null;
  }
}
