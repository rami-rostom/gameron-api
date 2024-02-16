const jwt = require('jsonwebtoken');
const token = require('./jwt');

const ACCESS_JWT_SECRET = String(process.env.ACCESS_JWT_SECRET);
const REFRESH_JWT_SECRET = String(process.env.REFRESH_JWT_SECRET);

const verifyToken = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res
      .status(401)
      .json({ 'error': 'Access denied.' });
  }

  try {
    // Verification of the access token. If verified, datas are added to userData and user can access to resources
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET);
    req.userData = decoded.userData;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // If access token is expired, using refresh token.
      const refreshToken = req.headers.refreshtoken;

      try {
        // Verification of the refresh token. If verified, new access token generated
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_JWT_SECRET);
        const newAccessToken = token.generateAccessToken(decodedRefresh.userId);

        // Verification of the access token. If verified, datas are added to userData and user can access to resources
        const decoded = jwt.verify(newAccessToken, ACCESS_JWT_SECRET);
        req.userData = decoded.userData;

        next();
      } catch (error) {
        res
          .status(401)
          .json({ 'error': 'Invalid refresh token' });
      }
    } else {
      res
        .status(401)
        .json({ 'error': 'Invalid token' });
    }
  }
};

module.exports = verifyToken;