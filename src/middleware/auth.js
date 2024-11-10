const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for a valid "Bearer" token format in the header
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res.status(403).json({
      message: "Authorization header missing or invalid format",
    });
  }

  const jwtToken = authHeader.split(" ")[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message); // Log for debugging
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    // Attach decoded credentials to request
    req.credentials = decoded;
    next();
  });
};

module.exports = auth;
