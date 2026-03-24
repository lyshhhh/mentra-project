const bcrypt = require("bcryptjs");

exports.generatePassword = async () => {
  const plain = "Mentra@123"; // demo friendly
  const hash = await bcrypt.hash(plain, 10);
  return { plain, hash };
};