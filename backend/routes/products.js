const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Discount = require('../models/Discount');
const { upload } = require('../config/cloudinary');

const computeEffectiveDiscount = (product, discounts) => {
    const productId = String(product._id);
    const categoryId = product.category?._id ? String(product.category._id) : null;

    const productSpecific = discounts.find(d => d.scope === 'product' && d.product && String(d.product) === productId);
    if (productSpecific) return productSpecific.percentage;

    if (categoryId) {
        const categorySpecific = discounts.find(d => d.scope === 'category' && d.category && String(d.category) === categoryId);
        if (categorySpecific) return categorySpecific.percentage;
    }

    const global = discounts.find(d => d.scope === 'all');
    if (global) return global.percentage;

    return 0;
};

const enrichWithDiscount = async (products) => {
    const discounts = await Discount.find({ isActive: true }).lean();
    return products.map(p => {
        const obj = p.toObject ? p.toObject() : p;
        const pct = computeEffectiveDiscount(obj, discounts);
        const finalPrice = pct > 0 ? Math.round(obj.price * (1 - pct / 100)) : obj.price;
        return { ...obj, discountPercentage: pct, finalPrice };
    });
};

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        const enriched = await enrichWithDiscount(products);
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a product
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const product = new Product({
            name_fr: req.body.name_fr,
            name_ar: req.body.name_ar,
            description_fr: req.body.description_fr,
            description_ar: req.body.description_ar,
            price: req.body.price,
            category: req.body.category,
            images: imageUrls,
            isSoldOut: req.body.isSoldOut === 'true',
            isBestSeller: req.body.isBestSeller === 'true',
            isNew: req.body.isNew === 'true',
        });

        const newProduct = await product.save();
        console.log('Product created successfully:', newProduct._id);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error in Product Creation:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Update a product
router.put('/:id', upload.array('images', 5), async (req, res) => {
    try {
        let updateData = {
            name_fr: req.body.name_fr,
            name_ar: req.body.name_ar,
            description_fr: req.body.description_fr,
            description_ar: req.body.description_ar,
            price: req.body.price,
            category: req.body.category,
            isSoldOut: req.body.isSoldOut === 'true',
            isBestSeller: req.body.isBestSeller === 'true',
            isNew: req.body.isNew === 'true',
        };

        // If new images are uploaded, update the images array
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('category');

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (err) {
        console.error('Error in Product Update:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
