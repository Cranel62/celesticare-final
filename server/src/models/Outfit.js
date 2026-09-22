import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema(
  {
    legacy_id: { type: String, sparse: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    legacy_user_id: { type: String, index: true },
    clothing_src: { type: String, default: '' },
    clothing_category: { type: String, default: null },
    clothing_style: { type: String, required: true },
    gender: { type: String, required: true },
    outfit_data: { type: Array, default: [] }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export default mongoose.model('Outfit', outfitSchema);