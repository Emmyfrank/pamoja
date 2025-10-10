import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Get the encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
console.log("The encryption key 00000000000000000", ENCRYPTION_KEY);

/**
 * Derives a proper length key from the provided key
 * @param {string} key - The key to derive from
 * @returns {Buffer} - A 32-byte key suitable for AES-256-GCM
 */
const deriveKey = (key) => {
  // Use PBKDF2 to derive a 32-byte key from the provided key
  return crypto.pbkdf2Sync(key, "salt", 10000, 32, "sha256");
};

/**
 * Encrypts data using AES-256-GCM
 * @param {string} text - The text to encrypt
 * @returns {Object} - Object containing encrypted data, IV, and auth tag
 */
export const encrypt = (text) => {
  try {
    if (!text) {
      throw new Error("Text to encrypt cannot be empty or undefined");
    }

    if (!ENCRYPTION_KEY) {
      throw new Error("Encryption key is not set in environment variables");
    }

    // Derive a proper length key
    const key = deriveKey(ENCRYPTION_KEY);

    // Generate a random IV
    const iv = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get the auth tag
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

/**
 * Decrypts data using AES-256-GCM
 * @param {string} encryptedData - The encrypted data
 * @param {string} iv - The initialization vector
 * @param {string} authTag - The authentication tag
 * @returns {string} - The decrypted text
 */
export const decrypt = (encryptedData, iv, authTag) => {
  try {
    if (!encryptedData || !iv || !authTag) {
      throw new Error("Missing required parameters for decryption");
    }

    if (!ENCRYPTION_KEY) {
      throw new Error("Encryption key is not set in environment variables");
    }

    // Derive a proper length key
    const key = deriveKey(ENCRYPTION_KEY);

    // Create decipher
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(iv, "hex")
    );

    // Set the auth tag
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};

/**
 * Generates a secure random key for encryption
 * @returns {string} - A secure random key
 */
export const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
