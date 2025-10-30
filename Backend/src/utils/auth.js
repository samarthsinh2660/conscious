import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticationError } from './error.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const extractToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw new AuthenticationError('Access token required');
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new AuthenticationError('Access token required');
  }
  
  return token;
};
