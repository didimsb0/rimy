const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema({
    visitorId: { type: String, required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String },
    price: { type: Number },
    channel: { type: String, default: 'whatsapp' },
}, { timestamps: true });

module.exports = mongoose.model('Conversion', conversionSchema);
