const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');

router.post('/', async (req, res) => {
    try {
        const { visitorId, userAgent, referrer, path } = req.body;
        if (!visitorId) {
            return res.status(400).json({ message: 'visitorId is required' });
        }
        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;
        const visit = await Visit.create({
            visitorId,
            userAgent: userAgent || req.headers['user-agent'],
            referrer,
            path,
            ip,
        });
        res.status(201).json({ id: visit._id });
    } catch (err) {
        console.error('Error tracking visit:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
