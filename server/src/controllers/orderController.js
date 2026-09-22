import Order from '../models/Order.js';

// POST /api/v1/orders (Authenticated users)
export const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress
    });

    res.status(201).json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/orders/my-orders (Protected: Logged-in user's own orders)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/orders/:id (IDOR Protected: Owner or Admin only)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'No order found with that ID'
      });
    }

    // IDOR verification
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. You do not have permission to view this requisition.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/orders (Admin only: view all requisitions)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'username email').sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders }
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/orders/:id/status (Admin only: update order fulfillment)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'No order found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    next(err);
  }
};