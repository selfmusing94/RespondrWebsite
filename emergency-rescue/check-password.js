const bcrypt = require('bcrypt');

const password = 'testPassword123';
const hash = '$2b$10$XCsJuX4wMDu9AWhHJGvySehg8brXK6nWhsLOYJG0a2APcu6zEZbia';

bcrypt.compare(password, hash, (err, isMatch) => {
  if (err) {
    console.error('Compare error:', err);
    return;
  }
  console.log('Password matches hash:', isMatch);
});