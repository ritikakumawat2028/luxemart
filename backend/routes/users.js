const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && user.password === password) { // In real app, use bcrypt
      const { password: pw, ...userWithoutPassword } = user.toObject();
      res.json({
        ...userWithoutPassword,
        token: 'fake-jwt-token'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password });
    const { password: pw, ...userWithoutPassword } = user.toObject();
    res.status(201).json({
      ...userWithoutPassword,
      token: 'fake-jwt-token'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/:id/role', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = req.body.role;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Wishlist - Add/Remove
router.post('/wishlist/:productId', async (req, res) => {
  try {
    // In real app, get userId from JWT
    const { userId } = req.body; 
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const productId = req.params.productId;
    const index = user.wishlist.findIndex(id => id.toString() === productId);
    
    if (index === -1) {
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
    } else {
      user.wishlist.splice(index, 1);
      await user.save();
      res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Wishlist
router.get('/wishlist/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wishlist');
    if (user) {
      res.json(user.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
