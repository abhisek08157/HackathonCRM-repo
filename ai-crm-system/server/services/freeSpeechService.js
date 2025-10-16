class FreeSpeechService {
  constructor() {
    // This service provides instructions for browser-based TTS
    // No API keys required!
  }

  // Generate speech instructions for frontend
  async getVoiceInstructions(text, voicePreference = 'professional') {
    try {
      console.log('🆓 Generating FREE voice instructions...');
      
      const voiceSettings = {
        professional: {
          rate: 0.9,
          pitch: 1.0,
          volume: 0.8,
          voice: 'en-US', 
          description: 'Clear, professional tone'
        },
        friendly: {
          rate: 1.0,
          pitch: 1.2,
          volume: 0.9,
          voice: 'en-US',
          description: 'Warm, friendly tone'
        },
        confident: {
          rate: 0.8,
          pitch: 0.9,
          volume: 1.0,
          voice: 'en-US',
          description: 'Strong, confident tone'
        },
        conversational: {
          rate: 1.1,
          pitch: 1.1,
          volume: 0.8,
          voice: 'en-US',
          description: 'Natural, conversational tone'
        }
      };

      const settings = voiceSettings[voicePreference] || voiceSettings.professional;
      
      // Break text into manageable chunks (browser TTS has limits)
      const chunks = this.splitTextIntoChunks(text, 200);
      
      console.log('✅ FREE voice instructions generated!');
      
      return {
        text,
        chunks,
        voiceSettings: settings,
        instructions: 'Use browser Speech Synthesis API',
        estimatedDuration: this.estimateDuration(text),
        method: 'BROWSER_TTS_FREE'
      };
      
    } catch (error) {
      console.error('❌ Error generating voice instructions:', error);
      throw new Error('Failed to generate voice instructions: ' + error.message);
    }
  }

  // Split text into chunks for better TTS processing
  splitTextIntoChunks(text, maxLength) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const chunks = [];
    let currentChunk = '';

    sentences.forEach(sentence => {
      if ((currentChunk + sentence).length < maxLength) {
        currentChunk += sentence + '. ';
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence + '. ';
      }
    });
    
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }

  // Estimate speech duration
  estimateDuration(text) {
    // Average speaking rate: 150 words per minute
    const wordCount = text.split(/\s+/).length;
    const durationMinutes = wordCount / 150;
    return Math.max(durationMinutes * 60, 3); // Minimum 3 seconds
  }

  // Get available browser voices info
  async getBrowserVoicesInfo() {
    return {
      instructions: 'Browser voices are detected client-side',
      commonVoices: [
        { name: 'Google US English', lang: 'en-US', gender: 'female' },
        { name: 'Google UK English Male', lang: 'en-GB', gender: 'male' },
        { name: 'Microsoft David', lang: 'en-US', gender: 'male' },
        { name: 'Microsoft Zira', lang: 'en-US', gender: 'female' }
      ],
      note: 'Actual voices depend on user\'s browser and operating system',
      method: 'BROWSER_VOICES_FREE'
    };
  }
}

module.exports = new FreeSpeechService();
