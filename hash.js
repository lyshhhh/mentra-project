const bcrypt = require("bcryptjs");

bcrypt.hash("admin@mentra", 10).then(hash => {
  console.log(hash);
});