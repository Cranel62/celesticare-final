import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const ADMIN_EMAIL_DOMAIN = '@celesticare.admin.com';
const ADMIN_SECRET_KEY = 'CelestiCare2025!';
const DEFAULT_PASSWORD = 'CelestiCare123!';

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { 
      username, 
      email, 
      password, 
      name, 
      birthdate, 
      gender, 
      zodiac_sign, 
      undertone, 
      season 
    } = req.body;

    const trimmedEmail = email.toLowerCase().trim();
    const isAdmin = trimmedEmail.endsWith(ADMIN_EMAIL_DOMAIN);

    if (isAdmin && password !== ADMIN_SECRET_KEY) {
      return res.status(400).json({
        success: false,
        error: 'Invalid admin secret key.'
      });
    }

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'This email is already registered.'
      });
    }

    const newUser = await User.create({
      username: username.trim(),
      email: trimmedEmail,
      password,
      role: isAdmin ? 'admin' : 'user',
      is_admin: isAdmin,
      ...(name && { name }),
      ...(birthdate && { birthdate }),
      ...(gender && { gender }),
      ...(zodiac_sign && { zodiac_sign }),
      ...(undertone && { undertone }),
      ...(season && { season })
    });

    const token = signToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        is_admin: newUser.is_admin,
        zodiac_sign: newUser.zodiac_sign,
        undertone: newUser.undertone,
        season: newUser.season,
        name: newUser.name
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();
    const isAdmin = trimmedEmail.endsWith(ADMIN_EMAIL_DOMAIN);

    const user = await User.findOne({ email: trimmedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    let isMatch = false;
    if (isAdmin) {
      isMatch = password === ADMIN_SECRET_KEY || (await user.matchPassword(password));
    } else {
      isMatch = await user.matchPassword(password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const token = signToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_admin: user.is_admin,
        zodiac_sign: user.zodiac_sign,
        undertone: user.undertone,
        season: user.season,
        aesthetic_result: user.aesthetic_result,
        style_result: user.style_result
      },
      needs_password_change: password === DEFAULT_PASSWORD
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/check-default
export const checkDefaultPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() }).select('+password');
    if (!user) return res.json({ has_default_password: false });

    const isDefault = await user.matchPassword(DEFAULT_PASSWORD);
    res.json({ has_default_password: isDefault });
  } catch {
    res.json({ has_default_password: false });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ authenticated: false, user: null });
  }
  res.status(200).json({
    authenticated: true,
    user: req.user
  });
};