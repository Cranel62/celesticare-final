import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'Philippines' }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export default mongoose.model('Order', orderSchema);