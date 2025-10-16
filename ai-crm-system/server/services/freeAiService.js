const fs = require('fs');
const path = require('path');

class FreeAIService {
  constructor() {
    // Pre-built templates for different call purposes
    this.callTemplates = {
      'follow_up': {
        greeting: "Hi {customerName}, this is {agentName} from {companyName}. I hope you're having a great day!",
        introduction: "I'm calling to follow up on our previous conversation about {topic}. Do you have a few minutes to chat?",
        main_points: [
          "I wanted to check if you had any questions about our discussion",
          "We've prepared some additional information that might be helpful",
          "I'd love to understand your timeline and next steps"
        ],
        questions: [
          "What are your thoughts on what we discussed?",
          "Is there any specific information you need from us?",
          "What would be the best way to move forward?"
        ],
        closing: "Thank you for your time today. I'll send you a follow-up email with the details we discussed. When would be a good time for our next conversation?",
        fallbacks: {
          busy: "I understand you're busy right now. When would be a better time for me to call back?",
          not_interested: "I appreciate your honesty. Is there anything specific that's changed, or should I check back with you in a few months?",
          need_more_info: "Absolutely! I'll prepare that information and send it over. What's the best way to get that to you?"
        }
      },
      'sales_pitch': {
        greeting: "Hello {customerName}, this is {agentName} from {companyName}. How are you doing today?",
        introduction: "I'm reaching out because I believe our {product} could really benefit {companyName}. Do you have a few minutes to hear about it?",
        main_points: [
          "We help companies like yours {primaryBenefit}",
          "Our solution has helped similar businesses {specificResult}",
          "I'd love to show you how this could work for your specific situation"
        ],
        questions: [
          "What challenges are you currently facing with {problemArea}?",
          "How are you handling {specificProcess} right now?",
          "What would an ideal solution look like for you?"
        ],
        closing: "Based on what you've shared, I think we could really help. Would you be open to a quick 15-minute demo next week?",
        fallbacks: {
          busy: "I totally understand. Would it be better if I sent you some information via email first?",
          not_interested: "No problem at all. Can I ask what's working well for you currently?",
          need_more_info: "Great question! Let me get you the exact details. What's your email address?"
        }
      },
      'appointment_confirmation': {
        greeting: "Hi {customerName}, this is {agentName} from {companyName}.",
        introduction: "I'm calling to confirm our appointment scheduled for {appointmentDate} at {appointmentTime}. Will you still be available?",
        main_points: [
          "I have you down for {appointmentType} on {appointmentDate}",
          "The meeting is scheduled to last about {duration}",
          "I'll be sending you a calendar invite with all the details"
        ],
        questions: [
          "Is the scheduled time still convenient for you?",
          "Do you need the meeting location or dial-in details?",
          "Is there anything specific you'd like to cover during our meeting?"
        ],
        closing: "Perfect! I'm looking forward to our conversation. You should receive a calendar invite shortly with all the details.",
        fallbacks: {
          busy: "I understand. What time would work better for you?",
          not_interested: "I see. Has something changed since we last spoke?",
          need_more_info: "Of course! Let me get you all the details you need."
        }
      },
      'customer_support': {
        greeting: "Hello {customerName}, this is {agentName} from {companyName} customer support.",
        introduction: "I'm calling regarding the support ticket you submitted. I have some updates and wanted to walk you through the solution.",
        main_points: [
          "I've reviewed your issue about {issueDescription}",
          "We've identified the cause and have a solution ready",
          "I want to make sure this resolves everything for you"
        ],
        questions: [
          "Can you confirm if you're still experiencing the issue?",
          "Would you like me to walk you through the solution step by step?",
          "Is there anything else I can help you with while we're on the call?"
        ],
        closing: "I'm glad we could resolve this for you. If you have any other questions, please don't hesitate to reach out to us.",
        fallbacks: {
          busy: "I understand you're busy. Can I send you the solution via email instead?",
          not_interested: "No problem. The solution will be in your support portal if you need it later.",
          need_more_info: "Absolutely! Let me provide you with more detailed information."
        }
      }
    };
  }

  // Generate personalized call script using free templates
  async generateCallScript(customer, purpose) {
    try {
      console.log(`🆓 Generating FREE call script for ${customer.name}...`);
      
      // Normalize purpose to match our templates
      const purposeKey = purpose.toLowerCase().replace(/\s+/g, '_');
      let template = this.callTemplates[purposeKey] || this.callTemplates['follow_up'];
      
      // Personalize the template with customer data
      const personalizedScript = {
        greeting: this.personalizeTemplate(template.greeting, customer), // 🔧 FIXED TYPO!
        introduction: this.personalizeTemplate(template.introduction, customer, purpose),
        main_points: template.main_points.map(point => 
          this.personalizeTemplate(point, customer, purpose)
        ),
        questions: template.questions.map(question => 
          this.personalizeTemplate(question, customer, purpose)
        ),
        closing: this.personalizeTemplate(template.closing, customer),
        fallbacks: {
          busy: this.personalizeTemplate(template.fallbacks.busy, customer),
          not_interested: this.personalizeTemplate(template.fallbacks.not_interested, customer),
          need_more_info: this.personalizeTemplate(template.fallbacks.need_more_info, customer)
        },
        metadata: {
          customerName: customer.name,
          customerCompany: customer.company || 'your organization',
          customerStatus: customer.status,
          purpose: purpose,
          generatedAt: new Date().toISOString(),
          method: 'FREE_TEMPLATE_BASED'
        }
      };

      console.log('✅ FREE call script generated successfully!');
      return personalizedScript;
      
    } catch (error) {
      console.error('❌ Error generating FREE call script:', error);
      throw new Error('Failed to generate call script: ' + error.message);
    }
  }

  // Helper function to personalize templates
  personalizeTemplate(template, customer, purpose = '') {
    return template
      .replace(/{customerName}/g, customer.name)
      .replace(/{companyName}/g, customer.company || 'your organization')
      .replace(/{agentName}/g, 'our representative')
      .replace(/{topic}/g, purpose || 'our services')
      .replace(/{product}/g, 'solution')
      .replace(/{primaryBenefit}/g, 'improve efficiency')
      .replace(/{specificResult}/g, 'increase productivity by 30%')
      .replace(/{problemArea}/g, purpose.toLowerCase() || 'operations')
      .replace(/{specificProcess}/g, 'current workflow')
      .replace(/{appointmentDate}/g, 'the scheduled date')
      .replace(/{appointmentTime}/g, 'the scheduled time')
      .replace(/{appointmentType}/g, 'consultation')
      .replace(/{duration}/g, '30 minutes')
      .replace(/{issueDescription}/g, 'your recent inquiry');
  }

  // Analyze sentiment using free rule-based approach
  async analyzeSentiment(transcriptionText, customerName = 'Customer') {
    try {
      console.log('🆓 Analyzing sentiment with FREE algorithm...');
      
      const text = transcriptionText.toLowerCase();
      
      // Positive indicators
      const positiveWords = [
        'great', 'excellent', 'perfect', 'amazing', 'wonderful', 'fantastic', 'love', 'like',
        'yes', 'absolutely', 'definitely', 'interested', 'excited', 'helpful', 'thank',
        'appreciate', 'good', 'nice', 'awesome', 'brilliant', 'outstanding', 'pleased'
      ];
      
      // Negative indicators  
      const negativeWords = [
        'bad', 'terrible', 'awful', 'hate', 'dislike', 'no', 'never', 'disappointed',
        'frustrated', 'angry', 'upset', 'problem', 'issue', 'complaint', 'wrong',
        'horrible', 'worst', 'annoyed', 'irritated', 'concerned', 'worried'
      ];
      
      // Neutral indicators
      const neutralWords = [
        'okay', 'fine', 'maybe', 'perhaps', 'might', 'could', 'possibly', 'think',
        'consider', 'unsure', 'neutral', 'average', 'normal', 'standard'
      ];

      // Question indicators (show engagement)
      const questionWords = ['what', 'how', 'when', 'where', 'why', 'which', 'who'];
      
      // Count occurrences
      let positiveCount = 0;
      let negativeCount = 0;
      let neutralCount = 0;
      let questionCount = 0;
      
      const words = text.split(/\s+/);
      
      words.forEach(word => {
        if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
        if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
        if (neutralWords.some(ntw => word.includes(ntw))) neutralCount++;
        if (questionWords.some(qw => word.includes(qw))) questionCount++;
      });

      // Determine overall sentiment
      let overall_sentiment = 'neutral';
      let confidence_score = 60;
      
      if (positiveCount > negativeCount && positiveCount > 0) {
        overall_sentiment = 'positive';
        confidence_score = Math.min(95, 60 + (positiveCount * 10));
      } else if (negativeCount > positiveCount && negativeCount > 0) {
        overall_sentiment = 'negative';  
        confidence_score = Math.min(95, 60 + (negativeCount * 10));
      }
      
      // Extract key emotions
      const key_emotions = [];
      if (positiveCount > 0) key_emotions.push('satisfied', 'interested');
      if (negativeCount > 0) key_emotions.push('concerned', 'hesitant');
      if (questionCount > 2) key_emotions.push('curious', 'engaged');
      if (key_emotions.length === 0) key_emotions.push('neutral');

      // Generate insights
      const analysis = {
        overall_sentiment,
        confidence_score,
        key_emotions,
        customer_concerns: negativeCount > 0 ? ['Some hesitation detected'] : [],
        positive_indicators: positiveCount > 0 ? ['Positive language used'] : [],
        negative_indicators: negativeCount > 0 ? ['Negative language detected'] : [],
        action_items: this.generateActionItems(overall_sentiment, questionCount, positiveCount, negativeCount),
        summary: this.generateSummary(overall_sentiment, positiveCount, negativeCount, questionCount),
        next_steps: this.generateNextSteps(overall_sentiment),
        priority_level: negativeCount > positiveCount ? 'high' : positiveCount > 0 ? 'medium' : 'low',
        analysis_method: 'FREE_RULE_BASED',
        word_counts: {
          positive: positiveCount,
          negative: negativeCount,
          neutral: neutralCount,
          questions: questionCount,
          total: words.length
        }
      };

      console.log('✅ FREE sentiment analysis completed!');
      return analysis;
      
    } catch (error) {
      console.error('❌ Error in FREE sentiment analysis:', error);
      throw new Error('Failed to analyze sentiment: ' + error.message);
    }
  }

  // Generate action items based on sentiment
  generateActionItems(sentiment, questionCount, positiveCount, negativeCount) {
    const actions = [];
    
    if (sentiment === 'positive') {
      actions.push('Follow up with proposal or next steps');
      actions.push('Schedule follow-up meeting');
      if (positiveCount > 2) actions.push('Consider upselling opportunities');
    } else if (sentiment === 'negative') {
      actions.push('Address customer concerns immediately');
      actions.push('Escalate to supervisor if needed');
      actions.push('Provide additional information to resolve issues');
    } else {
      actions.push('Send additional information to build interest');
      actions.push('Schedule follow-up call to check status');
    }
    
    if (questionCount > 2) {
      actions.push('Prepare detailed answers for customer questions');
    }
    
    return actions;
  }

  // Generate conversation summary
  generateSummary(sentiment, positiveCount, negativeCount, questionCount) {
    if (sentiment === 'positive') {
      return `Customer showed positive interest with ${positiveCount} positive indicators. ${questionCount > 0 ? 'Asked ' + questionCount + ' questions showing engagement.' : 'Good overall response.'}`;
    } else if (sentiment === 'negative') {
      return `Customer expressed concerns with ${negativeCount} negative indicators. Requires immediate attention and follow-up.`;
    } else {
      return `Neutral conversation with mixed signals. Customer seems undecided and may need more information.`;
    }
  }

  // Generate recommended next steps
  generateNextSteps(sentiment) {
    if (sentiment === 'positive') {
      return [
        'Send proposal within 24 hours',
        'Schedule presentation or demo',
        'Prepare contract or agreement',
        'Connect with decision makers'
      ];
    } else if (sentiment === 'negative') {
      return [
        'Call back within 2 hours to address concerns',
        'Escalate to senior team member',
        'Prepare detailed FAQ document',
        'Offer consultation with technical expert'
      ];
    } else {
      return [
        'Send informational packet',
        'Schedule follow-up call in 1 week',
        'Provide case studies and testimonials',
        'Offer free consultation or trial'
      ];
    }
  }

  // Generate follow-up email using templates
  async generateFollowUpEmail(customer, callSummary, sentimentAnalysis) {
    try {
      console.log('🆓 Generating FREE follow-up email...');
      
      const sentiment = sentimentAnalysis?.overall_sentiment || 'neutral';
      
      let emailTemplate = {
        positive: {
          subject: `Great connecting with you, ${customer.name}!`,
          body: `Hi ${customer.name},

Thank you for taking the time to speak with me today! I really enjoyed our conversation about your needs at ${customer.company || 'your organization'}.

Based on our discussion, I understand you're looking for solutions that can help with your current challenges. I'm excited about the opportunity to work together.

Next Steps:
${sentimentAnalysis?.action_items?.map(item => `• ${item}`).join('\n') || '• I will send you additional information\n• We will schedule a follow-up meeting'}

I'll be in touch soon with the information we discussed. Please don't hesitate to reach out if you have any questions in the meantime.

Best regards,
Your CRM Team

P.S. I look forward to helping ${customer.company || 'your organization'} achieve your goals!`,
          priority: 'normal'
        },
        negative: {
          subject: `Following up on your concerns - ${customer.name}`,
          body: `Hi ${customer.name},

Thank you for your time today and for sharing your honest feedback about your current situation.

I want to make sure we address all of your concerns properly:

${sentimentAnalysis?.customer_concerns?.map(concern => `• ${concern}`).join('\n') || '• I will review your specific requirements\n• We will provide detailed solutions'}

Our team is committed to finding the right solution for ${customer.company || 'your organization'}. I will personally ensure that we address each of your questions thoroughly.

Immediate Actions:
${sentimentAnalysis?.action_items?.map(item => `• ${item}`).join('\n') || '• I will call you back within 24 hours\n• We will prepare a customized proposal'}

Thank you for your patience, and I look forward to earning your trust.

Best regards,
Your CRM Team

P.S. Your feedback is valuable to us and helps us improve our service.`,
          priority: 'high'
        },
        neutral: {
          subject: `Thank you for your time today, ${customer.name}`,
          body: `Hi ${customer.name},

Thank you for speaking with me today about your needs at ${customer.company || 'your organization'}.

I understand you're evaluating your options, and I want to make sure you have all the information you need to make the best decision.

What's Next:
${sentimentAnalysis?.next_steps?.map(step => `• ${step}`).join('\n') || '• I will send you detailed information\n• We can schedule a follow-up when convenient'}

Please take your time to review everything, and don't hesitate to reach out with any questions. I'm here to help make this process as easy as possible for you.

Best regards,
Your CRM Team

P.S. I'm confident we can find a solution that works perfectly for ${customer.company || 'your organization'}.`,
          priority: 'normal'
        }
      };

      const selectedTemplate = emailTemplate[sentiment] || emailTemplate.neutral;
      
      console.log('✅ FREE follow-up email generated!');
      
      return {
        ...selectedTemplate,
        metadata: {
          customer: customer.name,
          company: customer.company,
          sentiment: sentiment,
          generatedAt: new Date().toISOString(),
          method: 'FREE_TEMPLATE_BASED'
        }
      };
      
    } catch (error) {
      console.error('❌ Error generating FREE email:', error);
      throw new Error('Failed to generate follow-up email: ' + error.message);
    }
  }
}

module.exports = new FreeAIService();
