// middleware/auth.js
import jwt from "jsonwebtoken";

// 🔐 Verify Token Middleware
const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Attach full decoded payload
    req.user = decoded; 
    // Now available:
    // req.user.id
    // req.user.role
    // req.user.email

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;