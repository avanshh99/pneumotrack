require('dotenv').config(); // Load environment variables from .env

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION
};