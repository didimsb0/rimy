const express = require('express');
const router = express.Router();
const Conversion = require('../models/Conversion');

router.post('/', async (req, res) => {
    try {
        const { visitorId, productId, productName, price, channel } = req.body;
        if (!visitorId) {
            return res.status(400).json({ message: 'visitorId is required' });
        }
        const conversion = await Conversion.create({
            visitorId,
            productId,
            productName,
            price,
            channel: channel || 'whatsapp',
        });
        res.status(201).json({ id: conversion._id });
    } catch (err) {
        console.error('Error tracking conversion:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
