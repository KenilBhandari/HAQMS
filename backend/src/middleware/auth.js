import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  if (!JWT_SECRET) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({
      error: "Invalid token format",
    });
  }
  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Authentication Failed' });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. User context missing.' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access Denied` });
    }

    next();
  };
};

const authorizeAdminOnlyLegacy = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

   if (req.user.role !== "ADMIN") {
     return res.status(403).json({
       error: "Admin only",
     });
   }

  next();
};

export { authenticate, authorize, authorizeAdminOnlyLegacy };
