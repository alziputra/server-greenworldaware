const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith('Bearer')) {
    return res.status(403).json({
      message: 'You need to specify the auth',
    });
  }

  const jwtToken = auth.split(' ')?.[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: 'Wrong Credentials',
      });
    }
    req.credentials = decoded;
    next();
  });
};

module.exports = auth;
