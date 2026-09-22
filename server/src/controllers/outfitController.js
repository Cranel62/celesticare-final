import Outfit from '../models/Outfit.js';

// GET /api/v1/outfits (Public catalog with filters)
export const getOutfits = async (req, res, next) => {
  try {
    const { style, gender, category } = req.query;
    const filter = {};

    if (style) filter.clothing_style = style;
    if (gender) filter.gender = gender;
    if (category) filter.clothing_category = category;

    const outfits = await Outfit.find(filter).populate('user', 'username email');

    res.status(200).json({
      status: 'success',
      results: outfits.length,
      data: { outfits }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/outfits/:id (Public single item)
export const getOutfitById = async (req, res, next) => {
  try {
    const outfit = await Outfit.findById(req.params.id).populate('user', 'username email');
    if (!outfit) {
      return res.status(404).json({
        status: 'fail',
        message: 'No item found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { outfit }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/outfits (Admin only)
export const createOutfit = async (req, res, next) => {
  try {
    const newOutfit = await Outfit.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: { outfit: newOutfit }
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/outfits/:id (Admin only)
export const updateOutfit = async (req, res, next) => {
  try {
    const outfit = await Outfit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!outfit) {
      return res.status(404).json({
        status: 'fail',
        message: 'No item found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { outfit }
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/outfits/:id (Admin only)
export const deleteOutfit = async (req, res, next) => {
  try {
    const outfit = await Outfit.findByIdAndDelete(req.params.id);
    if (!outfit) {
      return res.status(404).json({
        status: 'fail',
        message: 'No item found with that ID'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};