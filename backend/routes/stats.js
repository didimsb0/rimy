const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const Conversion = require('../models/Conversion');

router.get('/', async (req, res) => {
    try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [
            totalVisits,
            uniqueVisitorsAgg,
            totalConversions,
            convertingVisitorsAgg,
            visitsToday,
        ] = await Promise.all([
            Visit.countDocuments(),
            Visit.distinct('visitorId'),
            Conversion.countDocuments(),
            Conversion.distinct('visitorId'),
            Visit.countDocuments({ createdAt: { $gte: since } }),
        ]);

        const uniqueVisitors = uniqueVisitorsAgg.length;
        const convertingVisitors = convertingVisitorsAgg.length;
        const conversionRate = uniqueVisitors === 0
            ? 0
            : Math.round((convertingVisitors / uniqueVisitors) * 1000) / 10;

        res.json({
            totalVisits,
            uniqueVisitors,
            totalConversions,
            convertingVisitors,
            conversionRate,
            visitsToday,
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
