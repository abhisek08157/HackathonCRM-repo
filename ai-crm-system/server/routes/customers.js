const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all customers - This shows all customers in a list
router.get('/', auth, async (req, res) => {
  try {
    // Get page number from URL (like ?page=1)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Create filter for searching
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get customers from database
    const customers = await Customer.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ updated_at: -1 });
    
    // Count total customers
    const total = await Customer.countDocuments(filter);
    
    // Send response
    res.json({
      customers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST - Create new customer
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, company, status = 'lead' } = req.body;
    
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }

    // Create new customer
    const customer = new Customer({
      name,
      email,
      phone,
      company,
      status,
      notes: [{
        text: `Customer created by ${req.user.name}`,
        author: req.user.name,
        date: new Date()
      }]
    });

    // Save to database
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single customer by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT - Update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST - Add note to customer
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Add new note
    customer.notes.push({
      text,
      author: req.user.name,
      date: new Date()
    });
    
    // Save customer
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
