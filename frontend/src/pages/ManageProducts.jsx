import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    X,
    Image as ImageIcon,
    Check,
    AlertCircle,
    ArrowLeft,
    Loader2
} from 'lucide-react';

const ManageProducts = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

    const [formData, setFormData] = useState({
        name_fr: '', name_ar: '', price: '', category: '',
        description_fr: '', description_ar: '', isSoldOut: false, isBestSeller: false
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchCategories()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Create previews
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name_fr: product.name_fr,
            name_ar: product.name_ar,
            price: product.price,
            category: product.category?._id || '',
            description_fr: product.description_fr || '',
            description_ar: product.description_ar || '',
            isSoldOut: product.isSoldOut,
            isBestSeller: product.isBestSeller
        });
        setImages([]);
        setImagePreviews([]);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({
            name_fr: '', name_ar: '', price: '', category: '',
            description_fr: '', description_ar: '', isSoldOut: false, isBestSeller: false
        });
        setImages([]);
        setImagePreviews([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(img => data.append('images', img));

        try {
            if (editingProduct) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`, data);
                // Success feedback
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, data);
            }
            handleCancelForm();
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.name_ar.includes(searchTerm);
        const matchesCategory = selectedCategoryFilter ? (p.category?._id || p.category) === selectedCategoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="loading-state">
                <Loader2 className="spinner" size={40} />
                <p>Chargement des produits...</p>
            </div>
        );
    }

    return (
        <div className="manage-container">
            {!showForm ? (
                <div className="list-view">
                    <div className="view-header">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="header-filters">
                            <select
                                value={selectedCategoryFilter}
                                onChange={e => setSelectedCategoryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name_fr}</option>
                                ))}
                            </select>
                            <button className="btn btn-accent add-btn" onClick={() => setShowForm(true)}>
                                <Plus size={18} />
                                <span>Nouveau Produit</span>
                            </button>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Catégorie</th>
                                    <th>Prix</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(p => (
                                        <tr key={p._id}>
                                            <td>
                                                <div className="product-info-cell">
                                                    <img src={p.images[0]} alt={p.name_fr} className="table-img" />
                                                    <div className="product-names">
                                                        <span className="name-fr">{p.name_fr}</span>
                                                        <span className="name-ar">{p.name_ar}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="category-badge">
                                                    {categories.find(c => c._id === (p.category?._id || p.category))?.name_fr || 'Sans catégorie'}
                                                </span>
                                            </td>
                                            <td className="price-cell">{p.price} MRU</td>
                                            <td>
                                                <div className="status-badges">
                                                    {p.isSoldOut && <span className="badge badge-error">Sold Out</span>}
                                                    {p.isBestSeller && <span className="badge badge-accent">Best Seller</span>}
                                                    {!p.isSoldOut && !p.isBestSeller && <span className="badge badge-success">En stock</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-btns">
                                                    <button onClick={() => handleEdit(p)} className="icon-btn edit" title="Modifier"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete(p._id)} className="icon-btn delete" title="Supprimer"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="empty-state">
                                            <AlertCircle size={40} />
                                            <p>Aucun produit trouvé</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="form-view fade-in">
                    <div className="form-header">
                        <button className="back-btn" onClick={handleCancelForm}>
                            <ArrowLeft size={18} />
                            Retour à la liste
                        </button>
                        <h2>{editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="premium-form">
                        <div className="form-grid">
                            <div className="form-section main-info">
                                <h3>Informations Générales</h3>
                                <div className="input-group">
                                    <label>Nom du Produit (FR)</label>
                                    <input
                                        type="text"
                                        value={formData.name_fr}
                                        onChange={e => setFormData({ ...formData, name_fr: e.target.value })}
                                        required
                                        placeholder="Ex: Robe de soirée"
                                    />
                                </div>
                                <div className="input-group arabic-input">
                                    <label>اسم المنتج (AR)</label>
                                    <input
                                        type="text"
                                        value={formData.name_ar}
                                        onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                        required
                                        placeholder="اسم المنتج بالعربية"
                                        dir="rtl"
                                    />
                                </div>
                                <div className="grid-2">
                                    <div className="input-group">
                                        <label>Prix (MRU)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Catégorie</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Sélectionner</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name_fr}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Description (FR)</label>
                                    <textarea
                                        rows="4"
                                        value={formData.description_fr}
                                        onChange={e => setFormData({ ...formData, description_fr: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="form-section media-info">
                                <h3>Photos et Options</h3>
                                <div className="image-upload-zone">
                                    <label className="upload-label">
                                        <ImageIcon size={32} />
                                        <span>Ajouter des photos</span>
                                        <p>(Max 5 images)</p>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleImageChange}
                                            required={!editingProduct}
                                            accept="image/*"
                                        />
                                    </label>
                                    {imagePreviews.length > 0 && (
                                        <div className="previews-grid">
                                            {imagePreviews.map((url, i) => (
                                                <div key={i} className="preview-item">
                                                    <img src={url} alt="preview" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="options-zone">
                                    <label className="checkbox-card">
                                        <input
                                            type="checkbox"
                                            checked={formData.isSoldOut}
                                            onChange={e => setFormData({ ...formData, isSoldOut: e.target.checked })}
                                        />
                                        <div className="checkbox-content">
                                            <span className="title">Sold Out</span>
                                            <span className="desc">Marquer comme indisponible</span>
                                        </div>
                                    </label>

                                    <label className="checkbox-card">
                                        <input
                                            type="checkbox"
                                            checked={formData.isBestSeller}
                                            onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                                        />
                                        <div className="checkbox-content">
                                            <span className="title">Best Seller</span>
                                            <span className="desc">Mettre en avant sur l'accueil</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-ghost" onClick={handleCancelForm}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-accent submit-btn">
                                        <Check size={18} />
                                        {editingProduct ? 'Mettre à jour' : 'Enregistrer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <style jsx="true">{`
                .manage-container {
                    animation: fadeIn 0.3s ease;
                }

                /* List View Header */
                .view-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .search-bar {
                    flex: 1;
                    min-width: 300px;
                    position: relative;
                }

                .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }

                .search-bar input {
                    width: 100%;
                    padding: 12px 12px 12px 42px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                }

                .search-bar input:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
                    outline: none;
                }

                .header-filters {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .filter-select {
                    padding: 11px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    background: white;
                    font-size: 0.9rem;
                    color: #475569;
                    cursor: pointer;
                }

                .add-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    font-weight: 600;
                }

                /* Table Styling */
                .table-wrapper {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .admin-table th {
                    background: #f8fafc;
                    padding: 1rem 1.5rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .admin-table td {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                }

                .product-info-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .table-img {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    object-fit: cover;
                    border: 1px solid #f1f5f9;
                }

                .product-names {
                    display: flex;
                    flex-direction: column;
                }

                .name-fr { font-weight: 600; color: #1e293b; }
                .name-ar { font-size: 0.85rem; color: #94a3b8; margin-top: 2px; }

                .category-badge {
                    background: #f1f5f9;
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    color: #475569;
                }

                .price-cell {
                    font-weight: 700;
                    color: #1e293b;
                }

                .status-badges {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .badge {
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .badge-error { background: #fee2e2; color: #ef4444; }
                .badge-accent { background: rgba(212, 175, 55, 0.1); color: var(--accent); }
                .badge-success { background: #dcfce7; color: #22c55e; }

                .action-btns {
                    display: flex;
                    gap: 8px;
                }

                .icon-btn {
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #e2e8f0;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #64748b;
                }

                .icon-btn.edit:hover { background: #f1f5f9; color: var(--accent); border-color: var(--accent); }
                .icon-btn.delete:hover { background: #fee2e2; color: #ef4444; border-color: #ef4444; }

                .empty-state {
                    text-align: center;
                    padding: 4rem !important;
                    color: #94a3b8;
                }

                .empty-state p { margin-top: 1rem; }

                /* Form View */
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.95rem;
                }

                .form-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: #1e293b;
                    font-family: 'Inter', sans-serif;
                }

                .premium-form {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                    border: 1px solid #e2e8f0;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 3rem;
                }

                @media (max-width: 900px) {
                    .form-grid { grid-template-columns: 1fr; }
                }

                .form-section h3 {
                    font-size: 1.1rem;
                    margin-bottom: 1.5rem;
                    color: #1e293b;
                    padding-bottom: 0.75rem;
                    border-bottom: 2px solid #f1f5f9;
                }

                .input-group {
                    margin-bottom: 1.25rem;
                }

                .input-group label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 8px;
                }

                .input-group input, .input-group select, .input-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                }

                .input-group input:focus {
                    border-color: var(--accent);
                    outline: none;
                }

                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                /* Image Upload */
                .image-upload-zone {
                    background: #f8fafc;
                    border: 2px dashed #e2e8f0;
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .upload-label {
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: #64748b;
                }

                .upload-label input { display: none; }
                .upload-label span { font-weight: 600; margin-top: 10px; color: #1e293b; }
                .upload-label p { font-size: 0.8rem; margin: 4px 0 0 0; }

                .previews-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
                    gap: 10px;
                    margin-top: 1.5rem;
                }

                .preview-item img {
                    width: 100%;
                    aspect-ratio: 1;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* Checkbox Cards */
                .options-zone {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .checkbox-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .checkbox-card:hover { border-color: var(--accent); }
                .checkbox-card input { width: 18px; height: 18px; accent-color: var(--accent); }

                .checkbox-content .title { display: block; font-weight: 600; font-size: 0.95rem; }
                .checkbox-content .desc { font-size: 0.8rem; color: #64748b; }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                }

                .btn-ghost { background: transparent; color: #64748b; border: 1px solid #e2e8f0; }
                .btn-ghost:hover { background: #f1f5f9; }

                .submit-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                }

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 5rem;
                    color: #64748b;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }

                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.4s ease forwards; }

                .arabic-input input { text-align: right; font-family: 'Noto Sans Arabic', sans-serif; }
            `}</style>
        </div>
    );
};

export default ManageProducts;
