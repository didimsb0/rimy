const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');

router.get('/', async (req, res) => {
    try {
        const discounts = await Discount.find()
            .populate('category')
            .populate('product')
            .sort({ createdAt: -1 });
        res.json(discounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, scope, category, product, percentage, isActive } = req.body;

        if (!['all', 'category', 'product'].includes(scope)) {
            return res.status(400).json({ message: 'Scope invalide' });
        }
        if (scope === 'category' && !category) {
            return res.status(400).json({ message: 'Catégorie requise' });
        }
        if (scope === 'product' && !product) {
            return res.status(400).json({ message: 'Produit requis' });
        }

        const discount = new Discount({
            name,
            scope,
            category: scope === 'category' ? category : null,
            product: scope === 'product' ? product : null,
            percentage: Number(percentage),
            isActive: isActive !== undefined ? isActive : true,
        });

        const saved = await discount.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error('Error creating discount:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, scope, category, product, percentage, isActive } = req.body;

        const updateData = {
            name,
            scope,
            category: scope === 'category' ? category : null,
            product: scope === 'product' ? product : null,
            percentage: Number(percentage),
            isActive,
        };

        const updated = await Discount.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('category')
            .populate('product');
        if (!updated) return res.status(404).json({ message: 'Réduction non trouvée' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Discount.findByIdAndDelete(req.params.id);
        res.json({ message: 'Réduction supprimée' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
