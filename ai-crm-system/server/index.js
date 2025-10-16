const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/freeAi')); // 🆓 FREE AI ROUTES!

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🆓 AI-Enabled CRM Server - 100% FREE VERSION!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    features: [
      '✅ User Authentication',
      '✅ Customer Management', 
      '✅ Analytics Dashboard',
      '🆓 FREE Speech-to-Text (Browser API)',
      '🆓 FREE Text-to-Speech (Browser API)',
      '🆓 FREE AI Call Script Generation',
      '🆓 FREE Sentiment Analysis',
      '🆓 FREE Follow-up Email Generation'
    ],
    cost: '🎉 $0.00 - Completely FREE!',
    version: '1.0.0-FREE'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🆓 FREE AI CRM Server running on http://localhost:${PORT}`);
  console.log('🎉 100% FREE AI Features Available:');
  console.log('   ✅ Browser Speech Recognition (No API needed)');
  console.log('   ✅ Browser Text-to-Speech (No API needed)');
  console.log('   ✅ Template-based Script Generation');
  console.log('   ✅ Rule-based Sentiment Analysis');
  console.log('   ✅ Template-based Email Generation');
  console.log('   💰 Total Cost: $0.00');
});
