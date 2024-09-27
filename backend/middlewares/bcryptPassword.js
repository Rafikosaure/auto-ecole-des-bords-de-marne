const bcrypt = require("bcrypt");

// used to keep hashing consistent across multiple functions

const passwordHashing = async (password) => {
    return await bcrypt.hash(password, 10);
  }

const passwordCompare = async (testPassword, correctPassword) => {
    return await bcrypt.compare( testPassword, correctPassword)
}
exports.passwordHashing = passwordHashing;
exports.passwordCompare = passwordCompare;