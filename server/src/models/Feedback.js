import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    legacy_id: { type: String, sparse: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    legacy_user_id: { type: String, index: true },
    experience: { type: String, required: true },
    fashion_match: { type: String, default: '' },
    favorite_feature: { type: String, default: '' },
    vibe: { type: String, default: '' },
    suggestions: { type: String, default: '' }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export default mongoose.model('Feedback', feedbackSchema);