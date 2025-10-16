const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const router = express.Router();

// Dashboard metrics
router.get('/dashboard', auth, async (req, res) => {
  try {
    console.log('📊 Getting dashboard analytics...');

    const [
      totalCustomers,
      totalLeads,
      totalProspects,
      activeCustomers,
      recentInteractions
    ] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ status: 'lead' }),
      Customer.countDocuments({ status: 'prospect' }),
      Customer.countDocuments({ status: 'customer' }),
      Customer.aggregate([
        { $unwind: { path: '$interactions', preserveNullAndEmptyArrays: true } },
        { $sort: { 'interactions.date': -1 } },
        { $limit: 10 },
        {
          $project: {
            customerName: '$name',
            interactionType: '$interactions.type',
            interactionDate: '$interactions.date',
            sentiment: '$interactions.sentiment'
          }
        }
      ])
    ]);

    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? 
      ((activeCustomers / totalLeads) * 100).toFixed(2) : 0;

    // Get monthly statistics
    const monthlyStats = await Customer.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    console.log('✅ Dashboard analytics retrieved successfully');

    res.json({
      success: true,
      summary: {
        totalCustomers,
        totalLeads,
        totalProspects,
        activeCustomers,
        conversionRate: `${conversionRate}%`
      },
      recentInteractions: recentInteractions.filter(interaction => 
        interaction.customerName && interaction.interactionType
      ),
      monthlyStats
    });
  } catch (error) {
    console.error('❌ Dashboard analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Call performance analytics
router.get('/call-performance', auth, async (req, res) => {
  try {
    console.log('📞 Getting call performance analytics...');

    const callStats = await Customer.aggregate([
      { $unwind: { path: '$interactions', preserveNullAndEmptyArrays: true } },
      { $match: { 'interactions.type': 'call' } },
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          avgDuration: { $avg: '$interactions.duration' },
          sentimentBreakdown: {
            $push: '$interactions.sentiment'
          }
        }
      }
    ]);

    // Process sentiment breakdown
    const sentiments = callStats[0]?.sentimentBreakdown || [];
    const sentimentCounts = sentiments.reduce((acc, sentiment) => {
      if (sentiment) {
        acc[sentiment] = (acc[sentiment] || 0) + 1;
      }
      return acc;
    }, {});

    console.log('✅ Call performance analytics retrieved successfully');

    res.json({
      success: true,
      totalCalls: callStats[0]?.totalCalls || 0,
      averageDuration: Math.round(callStats[0]?.avgDuration || 0),
      sentimentBreakdown: sentimentCounts
    });
  } catch (error) {
    console.error('❌ Call performance analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Customer sentiment trends
router.get('/customer-sentiment', auth, async (req, res) => {
  try {
    console.log('😊 Getting customer sentiment trends...');

    const sentimentTrends = await Customer.aggregate([
      { $unwind: { path: '$interactions', preserveNullAndEmptyArrays: true } },
      { $match: { 'interactions.sentiment': { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            sentiment: '$interactions.sentiment',
            month: { $month: '$interactions.date' },
            year: { $year: '$interactions.date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    console.log('✅ Customer sentiment trends retrieved successfully');

    res.json({
      success: true,
      sentimentTrends,
      summary: {
        totalAnalyzed: sentimentTrends.reduce((sum, item) => sum + item.count, 0),
        message: 'Sentiment analysis data from customer interactions'
      }
    });
  } catch (error) {
    console.error('❌ Customer sentiment trends error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Lead conversion analytics
router.get('/conversion-rates', auth, async (req, res) => {
  try {
    console.log('📈 Getting conversion rate analytics...');

    const conversionData = await Customer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgDaysToConvert: { 
            $avg: {
              $dateDiff: {
                startDate: '$created_at',
                endDate: '$updated_at',
                unit: 'day'
              }
            }
          }
        }
      }
    ]);

    const totalCustomers = conversionData.reduce((sum, item) => sum + item.count, 0);
    
    const conversionRates = conversionData.map(item => ({
      status: item._id,
      count: item.count,
      percentage: totalCustomers > 0 ? ((item.count / totalCustomers) * 100).toFixed(2) : 0,
      avgDaysToConvert: Math.round(item.avgDaysToConvert || 0)
    }));

    console.log('✅ Conversion rate analytics retrieved successfully');

    res.json({
      success: true,
      conversionRates,
      totalCustomers,
      summary: {
        leads: conversionRates.find(r => r.status === 'lead')?.count || 0,
        prospects: conversionRates.find(r => r.status === 'prospect')?.count || 0,
        customers: conversionRates.find(r => r.status === 'customer')?.count || 0,
        inactive: conversionRates.find(r => r.status === 'inactive')?.count || 0
      }
    });
  } catch (error) {
    console.error('❌ Conversion rate analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Daily activity report
router.get('/reports/daily', auth, async (req, res) => {
  try {
    console.log('📅 Getting daily activity report...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      newCustomersToday,
      callsToday,
      emailsToday
    ] = await Promise.all([
      Customer.countDocuments({
        created_at: { $gte: today, $lt: tomorrow }
      }),
      Customer.aggregate([
        { $unwind: '$interactions' },
        { $match: { 
          'interactions.type': 'call',
          'interactions.date': { $gte: today, $lt: tomorrow }
        }},
        { $count: 'total' }
      ]),
      Customer.aggregate([
        { $unwind: '$interactions' },
        { $match: { 
          'interactions.type': 'email',
          'interactions.date': { $gte: today, $lt: tomorrow }
        }},
        { $count: 'total' }
      ])
    ]);

    console.log('✅ Daily activity report retrieved successfully');

    res.json({
      success: true,
      date: today.toISOString().split('T')[0],
      activities: {
        newCustomers: newCustomersToday,
        callsMade: callsToday[0]?.total || 0,
        emailsSent: emailsToday[0]?.total || 0
      },
      message: 'Daily activity summary generated successfully'
    });
  } catch (error) {
    console.error('❌ Daily activity report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Weekly performance report  
router.get('/reports/weekly', auth, async (req, res) => {
  try {
    console.log('📊 Getting weekly performance report...');

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const now = new Date();

    const [
      newCustomersWeek,
      callsWeek,
      emailsWeek
    ] = await Promise.all([
      Customer.countDocuments({
        created_at: { $gte: weekAgo, $lt: now }
      }),
      Customer.aggregate([
        { $unwind: '$interactions' },
        { $match: { 
          'interactions.type': 'call',
          'interactions.date': { $gte: weekAgo, $lt: now }
        }},
        { $count: 'total' }
      ]),
      Customer.aggregate([
        { $unwind: '$interactions' },
        { $match: { 
          'interactions.type': 'email',
          'interactions.date': { $gte: weekAgo, $lt: now }
        }},
        { $count: 'total' }
      ])
    ]);

    console.log('✅ Weekly performance report retrieved successfully');

    res.json({
      success: true,
      period: `${weekAgo.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`,
      performance: {
        newCustomers: newCustomersWeek,
        callsMade: callsWeek[0]?.total || 0,
        emailsSent: emailsWeek[0]?.total || 0,
        averagePerDay: {
          customers: Math.round(newCustomersWeek / 7),
          calls: Math.round((callsWeek[0]?.total || 0) / 7),
          emails: Math.round((emailsWeek[0]?.total || 0) / 7)
        }
      },
      message: 'Weekly performance summary generated successfully'
    });
  } catch (error) {
    console.error('❌ Weekly performance report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
