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

// ==========================================
// ADMIN CONTROLLERS (Converted from PHP)
// ==========================================

// GET /api/user/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, archivedUsers, adminUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ deleted_at: null }),
      User.countDocuments({ deleted_at: { $ne: null } }),
      User.countDocuments({ $or: [{ is_admin: true }, { role: 'admin' }] })
    ]);

    res.status(200).json({
      success: true,
      stats: { totalUsers, activeUsers, archivedUsers, adminUsers }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/admin/list?filter=active|archived|all
export const getAdminUsersList = async (req, res, next) => {
  try {
    const { filter = 'active' } = req.query;
    let query = {};

    if (filter === 'active') {
      query = { deleted_at: null };
    } else if (filter === 'archived') {
      query = { deleted_at: { $ne: null } };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ created_at: -1 });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/admin/user/:id
export const getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/admin/archive/:id
export const archiveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot archive your own admin account!' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.is_admin || user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot archive administrator accounts!' });
    }

    user.deleted_at = new Date();
    await user.save();

    res.status(200).json({ success: true, message: `User '${user.username}' archived successfully!` });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/admin/restore/:id
export const restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.deleted_at = null;
    await user.save();

    res.status(200).json({ success: true, message: `User '${user.username}' restored successfully!` });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/user/admin/permanent/:id
export const permanentDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!user.deleted_at) {
      return res.status(400).json({ success: false, message: 'Cannot permanently delete active users. Archive them first.' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `User '${user.username}' permanently deleted from database!` });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/admin/reset-password/:id
export const resetUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.password = 'CelestiCare123!';
    user.show_reset_notification = true;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: `Password reset to CelestiCare123! for ${user.username}` 
    });
  } catch (err) {
    next(err);
  }
};