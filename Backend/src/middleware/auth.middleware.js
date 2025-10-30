import { extractToken, verifyToken } from '../utils/auth.js';
import { asyncHandler } from '../utils/error.js';

export const authenticateToken = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  const decoded = verifyToken(token);
  req.user = decoded;
  next();
});
