import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    ArrowLeft,
    Check,
    Image as ImageIcon,
    ChevronRight,
    AlertCircle,
    Loader2,
    X
} from 'lucide-react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    // Form State
    const [formData, setFormData] = useState({
        name_fr: '', name_ar: '',
        price: '', category: '',
        description_fr: '', description_ar: '',
        isBestSeller: false, isSoldOut: false
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const nameFr = p.name_fr ? p.name_fr.toLowerCase() : '';
            const nameAr = p.name_ar || '';
            const matchesSearch = nameFr.includes(searchTerm.toLowerCase()) ||
                nameAr.includes(searchTerm);
            const matchesCategory = filterCategory === 'all' || p.category?._id === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, filterCategory]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(img => data.append('images', img));

        try {
            if (editingProduct) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`, data);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, data);
            }
            setShowForm(false);
            setEditingProduct(null);
            fetchData();
            setFormData({ name_fr: '', name_ar: '', price: '', category: '', description_fr: '', description_ar: '', isBestSeller: false, isSoldOut: false });
            setImages([]);
            setPreviews([]);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
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
            isBestSeller: product.isBestSeller || false,
            isSoldOut: product.isSoldOut || false
        });
        setPreviews(product.images || []);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous supprimer ce produit ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading && products.length === 0) {
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
                        <div className="header-title-section">
                            <h2>Produits</h2>
                            <p>{filteredProducts.length} articles au total</p>
                        </div>
                        <button className="btn btn-accent add-btn" onClick={() => setShowForm(true)}>
                            <Plus size={18} />
                            <span>Ajouter</span>
                        </button>
                    </div>

                    <div className="filter-bar">
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <Filter size={18} />
                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="all">Toutes les catégories</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name_fr}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Desktop View Table */}
                    <div className="table-wrapper desktop-only">
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
                                {filteredProducts.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            <div className="product-info-cell">
                                                <img src={p.images[0]} alt="" className="table-img" />
                                                <div className="p-names">
                                                    <span className="p-fr">{p.name_fr}</span>
                                                    <span className="p-ar">{p.name_ar}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="cat-badge">{p.category?.name_fr || 'Général'}</span></td>
                                        <td><span className="price-tag">{p.price} MRU</span></td>
                                        <td>
                                            <div className="status-badges">
                                                {p.isBestSeller && <span className="badge badge-gold">Top</span>}
                                                {p.isSoldOut && <span className="badge badge-red">Épuisé</span>}
                                                {!p.isSoldOut && <span className="badge badge-green">Stock</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button onClick={() => handleEdit(p)} className="icon-btn edit"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(p._id)} className="icon-btn delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View Cards */}
                    <div className="mobile-cards-view mobile-only">
                        {filteredProducts.map(p => (
                            <div key={p._id} className="product-mobile-card">
                                <div className="card-top">
                                    <img src={p.images[0]} alt="" className="card-img" />
                                    <div className="card-main-info">
                                        <h4 className="card-name">{p.name_fr}</h4>
                                        <span className="card-cat">{p.category?.name_fr || 'Général'}</span>
                                        <span className="card-price">{p.price} MRU</span>
                                    </div>
                                    <div className="card-status">
                                        {p.isSoldOut && <span className="dot dot-red"></span>}
                                        {!p.isSoldOut && <span className="dot dot-green"></span>}
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button onClick={() => handleEdit(p)} className="mobile-action-btn edit-action">
                                        <Edit2 size={16} /> Modifier
                                    </button>
                                    <button onClick={() => handleDelete(p._id)} className="mobile-action-btn delete-action">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="empty-state">
                            <AlertCircle size={40} />
                            <p>Aucun produit trouvé.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="form-view fade-in">
                    <div className="form-header">
                        <button className="back-btn" onClick={() => { setShowForm(false); setEditingProduct(null); }}>
                            <ArrowLeft size={18} />
                            <span>Retour</span>
                        </button>
                        <h2>{editingProduct ? 'Modifier' : 'Nouveau'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="premium-form">
                        <div className="form-grid">
                            <div className="form-section main-info">
                                <h3>Détails</h3>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Nom (FR)</label>
                                        <input
                                            type="text"
                                            value={formData.name_fr}
                                            onChange={e => setFormData({ ...formData, name_fr: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="input-group arabic-input">
                                        <label>(AR) الاسم</label>
                                        <input
                                            type="text"
                                            value={formData.name_ar}
                                            onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                </div>

                                <div className="input-row">
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
                                    <label>Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description_fr}
                                        onChange={e => setFormData({ ...formData, description_fr: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="form-section media-info">
                                <h3>Photos</h3>
                                <div className="image-uploader">
                                    <label className="upload-box">
                                        <ImageIcon size={24} />
                                        <span>Choisir des photos</span>
                                        <input type="file" multiple onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    <div className="previews-grid">
                                        {previews.map((src, idx) => (
                                            <div key={idx} className="preview-item">
                                                <img src={src} alt="" />
                                                <button type="button" onClick={() => removeImage(idx)} className="remove-img">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="options-section">
                                    <h3>Options</h3>
                                    <div className="checkbox-group">
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={formData.isBestSeller}
                                                onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                                            />
                                            <span className="slider"></span>
                                            <span className="toggle-label">En vedette</span>
                                        </label>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={formData.isSoldOut}
                                                onChange={e => setFormData({ ...formData, isSoldOut: e.target.checked })}
                                            />
                                            <span className="slider"></span>
                                            <span className="toggle-label text-red">Épuisé</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-footer">
                            <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditingProduct(null); }}>Annuler</button>
                            <button type="submit" className="btn btn-accent submit-btn">
                                <Check size={18} />
                                <span>{editingProduct ? 'Mettre à jour' : 'Créer'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <style jsx="true">{`
                .view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
                .header-title-section h2 { margin: 0; font-size: 1.5rem; font-weight: 800; color: #1e293b; }
                .header-title-section p { margin: 4px 0 0 0; color: #64748b; font-size: 0.9rem; }
                .add-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; font-weight: 600; }

                .filter-bar { 
                    display: flex; gap: 1rem; margin-bottom: 2rem; 
                    background: white; padding: 1rem; border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }
                .search-box { flex: 1; display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 0 1rem; border-radius: 8px; border: 1px solid #e2e8f0; }
                .search-box input { border: none; background: transparent; padding: 12px 0; width: 100%; outline: none; font-size: 0.95rem; }
                .filter-group { display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 0 1rem; border-radius: 8px; border: 1px solid #e2e8f0; }
                .filter-group select { border: none; background: transparent; padding: 12px 0; outline: none; font-weight: 500; font-size: 0.9rem; }

                /* Table styles */
                .table-wrapper { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
                .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
                .admin-table th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; color: #64748b; border-bottom: 1px solid #e2e8f0; }
                .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .product-info-cell { display: flex; align-items: center; gap: 1rem; }
                .table-img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
                .p-names { display: flex; flex-direction: column; }
                .p-fr { font-weight: 600; color: #1e293b; }
                .p-ar { font-size: 0.85rem; color: #64748b; }
                .cat-badge { font-size: 0.8rem; background: #f1f5f9; padding: 4px 10px; border-radius: 20px; color: #475569; font-weight: 500; }
                .price-tag { font-weight: 700; color: #1e293b; }
                
                /* Mobile Only Utilities */
                .desktop-only { display: block; }
                .mobile-only { display: none; }

                /* Mobile Cards */
                .product-mobile-card {
                    background: white; border-radius: 16px; padding: 1rem;
                    border: 1px solid #e2e8f0; margin-bottom: 1rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .card-top { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
                .card-img { width: 70px; height: 70px; border-radius: 12px; object-fit: cover; }
                .card-main-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
                .card-name { margin: 0; font-size: 1rem; font-weight: 700; color: #1e293b; }
                .card-cat { font-size: 0.8rem; color: #64748b; }
                .card-price { font-weight: 800; color: var(--accent); font-size: 0.95rem; }
                .card-actions { display: flex; gap: 0.5rem; border-top: 1px solid #f1f5f9; padding-top: 0.75rem; }
                .mobile-action-btn { 
                    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 10px; border-radius: 8px; font-size: 0.9rem; font-weight: 600;
                    cursor: pointer; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569;
                }
                .edit-action:active { background: #f1f5f9; }
                .delete-action { flex: 0 0 50px; color: #ef4444; border-color: #fee2e2; background: #fff1f2; }

                .dot { width: 8px; height: 8px; border-radius: 50%; }
                .dot-green { background: #10b981; }
                .dot-red { background: #ef4444; }

                /* Form Styles */
                .premium-form { background: white; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; }
                .form-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 2.5rem; }
                .back-btn { display: flex; align-items: center; gap: 8px; background: none; border: none; color: #64748b; cursor: pointer; font-weight: 600; }
                .form-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; }
                .form-section h3 { font-size: 1.1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem; margin-bottom: 1.5rem; color: #1e293b; }
                .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
                .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
                .input-group label { font-size: 0.85rem; font-weight: 600; color: #475569; }
                .input-group input, .input-group select, .input-group textarea { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-family: inherit; font-size: 0.95rem; transition: border-color 0.2s; }
                .input-group input:focus { border-color: var(--accent); outline: none; }
                .arabic-input input { text-align: right; }

                .image-uploader { margin-bottom: 2rem; }
                .upload-box { 
                    border: 2px dashed #cbd5e1; border-radius: 16px; padding: 2rem;
                    display: flex; flex-direction: column; align-items: center; gap: 10px;
                    color: #64748b; cursor: pointer; transition: all 0.2s;
                }
                .upload-box:hover { border-color: var(--accent); color: var(--accent); background: #fdfbf7; }
                .upload-box input { display: none; }
                .previews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 10px; margin-top: 1rem; }
                .preview-item { position: relative; width: 100%; aspect-ratio: 1; }
                .preview-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
                .remove-img { position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 18px; height: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

                .toggle { display: flex; align-items: center; gap: 12px; cursor: pointer; margin-bottom: 1rem; }
                .slider { position: relative; width: 34px; height: 18px; background: #e2e8f0; border-radius: 20px; transition: 0.3s; }
                .slider:before { content: ""; position: absolute; height: 12px; width: 12px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
                input:checked + .slider { background: var(--accent); }
                input:checked + .slider:before { transform: translateX(16px); }
                .toggle-label { font-size: 0.9rem; font-weight: 500; color: #475569; }
                .text-red { color: #ef4444; }

                .form-footer { margin-top: 3rem; display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #f1f5f9; padding-top: 2rem; }
                .btn-ghost { background: #f8fafc; color: #64748b; }
                .submit-btn { display: flex; align-items: center; gap: 8px; padding: 14px 32px; font-weight: 700; }

                @media (max-width: 1024px) {
                    .form-grid { grid-template-columns: 1fr; gap: 1rem; }
                }

                @media (max-width: 768px) {
                    .desktop-only { display: none; }
                    .mobile-only { display: block; }
                    .filter-bar { flex-direction: column; }
                    .add-btn span { display: none; }
                    .add-btn { height: 48px; border-radius: 12px; padding: 0 12px; }
                    .view-header { margin-bottom: 1.5rem; }
                    .premium-form { padding: 1.25rem; border-radius: 12px; }
                    .input-row { grid-template-columns: 1fr; gap: 0; }
                    .form-footer { flex-direction: column-reverse; }
                    .btn { width: 100%; justify-content: center; }
                }

                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spinner { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default ManageProducts;
