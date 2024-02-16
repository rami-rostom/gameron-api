const jwt = require('jsonwebtoken');

const token = {
  generateAccessToken: (userData) => {
    return jwt.sign({
      userId: userData.id
    },
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: '1h'
    });
  },

  generateRefreshToken: (userData) => {
    return jwt.sign({
      userId: userData.id
    },
    process.env.REFRESH_JWT_SECRET,
    {
      expiresIn: '30d'
    });
  }
};

module.exports = token;