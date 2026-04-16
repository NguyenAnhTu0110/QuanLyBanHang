const crypto = require("crypto");

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

const hashPassword = (password) => {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(":");
  const passwordHash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(originalHash, "hex"),
    Buffer.from(passwordHash, "hex")
  );
};

module.exports = {
  hashPassword,
  verifyPassword,
};
