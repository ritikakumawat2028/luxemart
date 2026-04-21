const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { 
      userId, 
      items, 
      shippingAddress, 
      paymentMethod, 
      totalAmount 
    } = req.body;

    if (items && items.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      const order = new Order({
        userId,
        items,
        shippingAddress,
        paymentMethod,
        totalAmount,
        paymentStatus: 'completed' // In real app, check payment gateway
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email').populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
