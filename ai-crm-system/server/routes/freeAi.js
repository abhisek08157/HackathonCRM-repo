const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FreeAIService = require('../services/freeAiService');
const FreeSpeechService = require('../services/freeSpeechService');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads (for speech-to-text)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

// FREE Speech to Text endpoint (returns instructions for browser API)
router.post('/speech-to-text', auth, async (req, res) => {
  try {
    console.log('🆓 Providing FREE speech-to-text instructions');
    
    res.json({
      success: true,
      method: 'BROWSER_API_FREE',
      instructions: {
        api: 'Web Speech API (webkitSpeechRecognition)',
        implementation: `
// Use this JavaScript code in your frontend:
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  console.log('Transcription:', transcript);
};

recognition.start();
        `,
        features: [
          '✅ 100% Free - No API keys needed',
          '✅ Real-time transcription',
          '✅ Works in Chrome, Edge, Safari',
          '✅ Multiple languages supported',
          '✅ No server processing required'
        ],
        limitations: [
          'Requires user permission',
          'Works only over HTTPS',
          'Browser-dependent accuracy'
        ]
      },
      alternatives: {
        desktop: 'For higher accuracy, consider using Whisper locally',
        mobile: 'Mobile browsers have good built-in speech recognition'
      }
    });
    
  } catch (error) {
    console.error('❌ Error providing speech-to-text instructions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to provide instructions', 
      error: error.message 
    });
  }
});

// FREE Text to Speech endpoint
router.post('/text-to-speech', auth, async (req, res) => {
  try {
    const { text, voicePreference } = req.body;
    console.log('🆓 Generating FREE text-to-speech instructions');
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ 
        message: 'Text too long. Maximum 5000 characters for optimal performance.' 
      });
    }

    const voiceInstructions = await FreeSpeechService.getVoiceInstructions(text, voicePreference);
    
    res.json({
      success: true,
      method: 'BROWSER_TTS_FREE',
      voiceInstructions,
      implementation: `
// Use this JavaScript code in your frontend:
const utterThis = new SpeechSynthesisUtterance('${text.replace(/'/g, "\\'")}');
utterThis.rate = ${voiceInstructions.voiceSettings.rate};
utterThis.pitch = ${voiceInstructions.voiceSettings.pitch};
utterThis.volume = ${voiceInstructions.voiceSettings.volume};

// Get available voices
const voices = speechSynthesis.getVoices();
if (voices.length > 0) {
  utterThis.voice = voices.find(voice => voice.lang.includes('${voiceInstructions.voiceSettings.voice}')) || voices[0];
}

speechSynthesis.speak(utterThis);
      `,
      textLength: text.length,
      features: [
        '✅ 100% Free - No API keys needed',
        '✅ Natural-sounding voices',
        '✅ Multiple voice options',
        '✅ Adjustable speech rate and pitch',
        '✅ Works offline'
      ]
    });
    
  } catch (error) {
    console.error('❌ Text-to-speech error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate speech instructions', 
      error: error.message 
    });
  }
});

// FREE Call script generation
router.post('/generate-script', auth, async (req, res) => {
  try {
    const { customerId, purpose } = req.body;
    console.log('🆓 Generating FREE call script for customer:', customerId);
    
    if (!customerId || !purpose) {
      return res.status(400).json({ 
        message: 'Customer ID and purpose are required' 
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const script = await FreeAIService.generateCallScript(customer, purpose);
    
    res.json({
      success: true,
      method: 'FREE_TEMPLATE_BASED',
      script,
      customer: {
        name: customer.name,
        company: customer.company,
        status: customer.status
      },
      purpose,
      features: [
        '✅ Personalized with customer data',
        '✅ Professional templates',
        '✅ Multiple call purposes supported',
        '✅ Fallback responses included',
        '✅ No API costs'
      ]
    });
    
  } catch (error) {
    console.error('❌ Script generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate script', 
      error: error.message 
    });
  }
});

// FREE Sentiment analysis
router.post('/analyze-sentiment', auth, async (req, res) => {
  try {
    const { text, customerId } = req.body;
    console.log('🆓 Performing FREE sentiment analysis');
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required for analysis' });
    }

    let customerName = 'Customer';
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (customer) customerName = customer.name;
    }

    const analysis = await FreeAIService.analyzeSentiment(text, customerName);
    
    res.json({
      success: true,
      method: 'FREE_RULE_BASED',
      analysis,
      textLength: text.length,
      features: [
        '✅ Rule-based sentiment detection',
        '✅ Emotion identification',
        '✅ Action items generation',
        '✅ Priority level assessment',
        '✅ No API costs'
      ]
    });
    
  } catch (error) {
    console.error('❌ Sentiment analysis error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to analyze sentiment', 
      error: error.message 
    });
  }
});

// Get available FREE voices info
router.get('/voices', auth, async (req, res) => {
  try {
    console.log('🆓 Getting FREE voice information');
    const voicesInfo = await FreeSpeechService.getBrowserVoicesInfo();
    
    res.json({
      success: true,
      method: 'BROWSER_VOICES_FREE',
      voicesInfo,
      instructions: 'Use speechSynthesis.getVoices() in browser to get actual available voices',
      presetVoices: {
        'professional': 'Clear, professional tone (Rate: 0.9, Pitch: 1.0)',
        'friendly': 'Warm, friendly tone (Rate: 1.0, Pitch: 1.2)', 
        'confident': 'Strong, confident tone (Rate: 0.8, Pitch: 0.9)',
        'conversational': 'Natural, conversational tone (Rate: 1.1, Pitch: 1.1)'
      },
      features: [
        '✅ Browser-native voices',
        '✅ No API costs',
        '✅ Customizable speech settings',
        '✅ Multiple languages',
        '✅ Real-time generation'
      ]
    });
    
  } catch (error) {
    console.error('❌ Error fetching voice information:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch voice information', 
      error: error.message 
    });
  }
});

// Generate FREE follow-up email
router.post('/generate-email', auth, async (req, res) => {
  try {
    const { customerId, callSummary, sentimentAnalysis } = req.body;
    console.log('🆓 Generating FREE follow-up email');
    
    if (!customerId || !callSummary) {
      return res.status(400).json({ 
        message: 'Customer ID and call summary are required' 
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const email = await FreeAIService.generateFollowUpEmail(
      customer, 
      callSummary, 
      sentimentAnalysis || {}
    );
    
    res.json({
      success: true,
      method: 'FREE_TEMPLATE_BASED',
      email,
      customer: {
        name: customer.name,
        email: customer.email,
        company: customer.company
      },
      features: [
        '✅ Personalized email templates',
        '✅ Sentiment-based content',
        '✅ Professional formatting',
        '✅ Action items included',
        '✅ No API costs'
      ]
    });
    
  } catch (error) {
    console.error('❌ Email generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate email', 
      error: error.message 
    });
  }
});

// System information endpoint
router.get('/system-info', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      system: 'AI CRM - 100% FREE VERSION',
      features: {
        speechToText: '✅ Browser Web Speech API (FREE)',
        textToSpeech: '✅ Browser Speech Synthesis API (FREE)', 
        scriptGeneration: '✅ Template-based AI Scripts (FREE)',
        sentimentAnalysis: '✅ Rule-based Sentiment Analysis (FREE)',
        emailGeneration: '✅ Template-based Email Generation (FREE)',
        voiceManagement: '✅ Browser Voice Management (FREE)'
      },
      costs: {
        apiKeys: '✅ No API keys required',
        monthlyFees: '✅ No monthly fees',
        usageLimits: '✅ No usage limits',
        totalCost: '✅ $0.00'
      },
      requirements: [
        'Modern web browser (Chrome, Firefox, Safari, Edge)',
        'HTTPS connection for speech features',
        'Microphone access permission'
      ],
      advantages: [
        '100% Free to use',
        'No external dependencies',
        'Privacy-friendly (no data sent to external APIs)',
        'Works offline for TTS',
        'Instant response times'
      ]
    });
    
  } catch (error) {
    console.error('❌ Error getting system info:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get system information', 
      error: error.message 
    });
  }
});

module.exports = router;
