const authorizeRole = (...allowedRoles) => (req, res, next) => {
  const { role } = req.credentials; // Ambil role dari decoded JWT

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({
      message: "You are not authorized to access this resource",
    });
  }

  next();
};

module.exports = authorizeRole;
