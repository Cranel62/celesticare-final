import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'node:crypto';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/emailService.js';

const ADMIN_EMAIL_DOMAIN = '@celesticare.admin.com';

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
    const adminSecretKey = process.env.ADMIN_SECRET_KEY;

    if (isAdmin && (!adminSecretKey || password !== adminSecretKey)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid admin secret key.'
      });
    }

    let user = await User.findOne({ email: trimmedEmail });
    if (user && user.isVerified !== false) {
      return res.status(202).json({
        success: true,
        message: 'If this email can be registered, a verification email will be sent.'
      });
    }

    if (!user) {
      user = new User({
        username: username.trim(),
        email: trimmedEmail,
        password,
        role: isAdmin ? 'admin' : 'user',
        is_admin: isAdmin,
        isVerified: false,
        ...(name && { name }),
        ...(birthdate && { birthdate }),
        ...(gender && { gender }),
        ...(zodiac_sign && { zodiac_sign }),
        ...(undertone && { undertone }),
        ...(season && { season })
      });
    }

    const verificationToken = randomBytes(32).toString('hex');
    user.verificationTokenHash = createHash('sha256').update(verificationToken).digest('hex');
    user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch {
      return res.status(503).json({
        success: false,
        error: 'Verification email could not be sent. Please try again shortly.'
      });
    }

    res.status(202).json({
      success: true,
      message: 'If this email can be registered, a verification email will be sent.'
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

    const user = await User.findOne({ email: trimmedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    if (user.isVerified === false) {
      return res.status(403).json({
        success: false,
        error: 'Please verify your email address before logging in.'
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
      needs_password_change: Boolean(process.env.DEFAULT_PASSWORD && password === process.env.DEFAULT_PASSWORD)
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

    const defaultPassword = process.env.DEFAULT_PASSWORD;
    const isDefault = defaultPassword
      ? await user.matchPassword(defaultPassword)
      : false;
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

// GET /api/auth/verify-email?token=...
export const verifyEmail = async (req, res, next) => {
  try {
    const token = typeof req.query.token === 'string' ? req.query.token : '';
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification link.' });
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const user = await User.findOneAndUpdate({
      verificationTokenHash: tokenHash,
      verificationTokenExpiresAt: { $gt: new Date() },
      isVerified: false
    }, {
      $set: { isVerified: true },
      $unset: { verificationTokenHash: 1, verificationTokenExpiresAt: 1 }
    }, { new: true });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification link.' });
    }

    return res.status(200).json({ success: true, message: 'Email verified. You can now log in.' });
  } catch (err) {
    next(err);
  }
};