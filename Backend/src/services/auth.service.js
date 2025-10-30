import userRepository from '../repositories/user.repository.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { AuthenticationError, ConflictError } from '../utils/error.js';

class AuthService {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Token and user data
   */
  async register(userData) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User already exists with this email');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    const user = await userRepository.create({
      email: userData.email,
      passwordHash,
      fullName: userData.fullName,
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      },
    };
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Token and user data
   */
  async login(credentials) {
    // Find user
    const user = await userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await comparePassword(credentials.password, user.password_hash);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      },
    };
  }

  /**
   * Get current user by ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      createdAt: user.created_at,
    };
  }
}

export default new AuthService();
