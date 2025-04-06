const jwt = require('jsonwebtoken');
const config = require('../config/config');

function generateAuthToken(user) {
  const payload = { id: user.id, email: user.email };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpirationTime 
  });

  return token;
}

function verifyAuthToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  generateAuthToken,
  verifyAuthToken
};
