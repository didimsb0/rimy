const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    visitorId: { type: String, required: true, index: true },
    userAgent: { type: String },
    ip: { type: String },
    referrer: { type: String },
    path: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
