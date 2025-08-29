import jwt from "jsonwebtoken";

// Middleware to verify JWT token from cookies
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next(); // Proceed without checking user role
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};
