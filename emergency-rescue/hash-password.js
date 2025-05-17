const bcrypt = require('bcrypt');

const password = 'testPassword123';// Replace with the password you want to hash
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Hashed password:', hash);
});