import User from '../models/User.js';
import Outfit from '../models/Outfit.js';

// GET /api/user/profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// POST & PUT /api/user/profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'gender', 'birthdate', 'zodiac_sign', 'undertone',
      'season', 'aesthetic_result', 'style_result'
    ];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    if (req.body.new_password) {
      if (req.body.current_password) {
        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.matchPassword(req.body.current_password);
        if (!isMatch && !req.body.forced_change) {
          return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        }
      }
      const user = await User.findById(req.user._id);
      user.password = req.body.new_password;
      await user.save();
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, message: 'Profile updated successfully!', user: updatedUser });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/user/profile
export const deleteUserProfile = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ success: true, message: 'Profile deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/outfits
export const getUserOutfits = async (req, res, next) => {
  try {
    const outfits = await Outfit.find({ user: req.user._id });
    res.status(200).json({ success: true, outfits });
  } catch (err) {
    next(err);
  }
};

// POST /api/undertone/save
export const saveUndertone = async (req, res, next) => {
  try {
    const { undertone, zodiac, season } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { undertone, zodiac_sign: zodiac, season },
      { new: true }
    );
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};

// GET /api/tarot/recent
export const getRecentTarot = async (req, res) => {
  res.status(200).json({ reading: null });
};