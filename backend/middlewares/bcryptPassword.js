const bcrypt = require("bcrypt");

// used to keep hashing consistent across multiple functions

/**
 * @async Hashes a given string.
 * @param {string} password - password to be hashed.
 * @returns {string} Hashed password.
 */
const passwordHashing = async (password) => {
    return await bcrypt.hash(password, 10);
  }

  /**
 * @async Compares two hashed password to find a match.
 * @param {string} testPassword - Password to be tested.
 * @param {string} correctPassword - Password to be compared with, retrieved from the DB.
 * @returns {boolean} Whether or not the match is successful.
 */
const passwordCompare = async (testPassword, correctPassword) => {
    return await bcrypt.compare(testPassword, correctPassword)
}
exports.passwordHashing = passwordHashing;
exports.passwordCompare = passwordCompare;