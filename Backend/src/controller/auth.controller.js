import authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/error.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;

  const result = await authService.register({ email, password, fullName });

  res.status(201).json({
    message: 'User registered successfully',
    ...result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.json({
    message: 'Login successful',
    ...result,
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);

  res.json({ user });
});
