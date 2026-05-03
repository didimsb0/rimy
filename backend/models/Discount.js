const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    name: { type: String },
    scope: { type: String, enum: ['all', 'category', 'product'], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    percentage: { type: Number, required: true, min: 1, max: 99 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
