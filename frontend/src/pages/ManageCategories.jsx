import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit2,
    Trash2,
    ArrowLeft,
    Check,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    X
} from 'lucide-react';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name_fr: '', name_ar: '' });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous supprimer cette catégorie ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`);
                fetchCategories();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name_fr: category.name_fr,
            name_ar: category.name_ar,
        });
        setImage(null);
        setImagePreview(category.image);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ name_fr: '', name_ar: '' });
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name_fr', formData.name_fr);
        data.append('name_ar', formData.name_ar);
        if (image) data.append('image', image);

        try {
            if (editingCategory) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/categories/${editingCategory._id}`, data);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, data);
            }
            handleCancelForm();
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
        }
    };

    if (loading && categories.length === 0) {
        return (
            <div className="loading-state">
                <Loader2 className="spinner" size={40} />
                <p>Chargement des catégories...</p>
            </div>
        );
    }

    return (
        <div className="manage-container">
            {!showForm ? (
                <div className="list-view">
                    <div className="view-header">
                        <div className="header-title-section">
                            <h2>Catégories</h2>
                            <p>{categories.length} catégories enregistrées</p>
                        </div>
                        <button className="btn btn-accent add-btn" onClick={() => setShowForm(true)}>
                            <Plus size={18} />
                            <span>Ajouter</span>
                        </button>
                    </div>

                    {/* Desktop View Table */}
                    <div className="table-wrapper desktop-only">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Aperçu</th>
                                    <th>Nom (FR)</th>
                                    <th>Nom (AR)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat._id}>
                                        <td>
                                            <img src={cat.image} alt="" className="table-img" />
                                        </td>
                                        <td className="name-fr">{cat.name_fr}</td>
                                        <td className="name-ar" dir="rtl">{cat.name_ar}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button onClick={() => handleEdit(cat)} className="icon-btn edit"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(cat._id)} className="icon-btn delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View Cards */}
                    <div className="mobile-cards-view mobile-only">
                        {categories.map(cat => (
                            <div key={cat._id} className="category-mobile-card">
                                <div className="card-top">
                                    <img src={cat.image} alt="" className="card-img" />
                                    <div className="card-info">
                                        <h4 className="card-name-fr">{cat.name_fr}</h4>
                                        <span className="card-name-ar" dir="rtl">{cat.name_ar}</span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button onClick={() => handleEdit(cat)} className="mobile-action-btn edit-action">
                                        <Edit2 size={16} /> Modifier
                                    </button>
                                    <button onClick={() => handleDelete(cat._id)} className="mobile-action-btn delete-action">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="empty-state">
                            <AlertCircle size={40} />
                            <p>Aucune catégorie trouvée.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="form-view fade-in">
                    <div className="form-header">
                        <button className="back-btn" onClick={handleCancelForm}>
                            <ArrowLeft size={18} />
                            <span>Retour</span>
                        </button>
                        <h2>{editingCategory ? 'Modifier' : 'Nouvelle'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="premium-form simple-form">
                        <div className="form-content">
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Nom (FR)</label>
                                    <input
                                        type="text"
                                        value={formData.name_fr}
                                        onChange={e => setFormData({ ...formData, name_fr: e.target.value })}
                                        required
                                        placeholder="Ex: Parfums"
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

                            <div className="image-section">
                                <label className="upload-box">
                                    <ImageIcon size={24} />
                                    <span>Choisir une image</span>
                                    <input type="file" onChange={handleImageChange} accept="image/*" />
                                </label>
                                {imagePreview && (
                                    <div className="single-preview">
                                        <img src={imagePreview} alt="Aperçu" />
                                        <button type="button" className="remove-preview" onClick={() => { setImage(null); setImagePreview(null); }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="form-footer">
                                <button type="button" className="btn btn-ghost" onClick={handleCancelForm}>Annuler</button>
                                <button type="submit" className="btn btn-accent submit-btn">
                                    <Check size={18} />
                                    <span>{editingCategory ? 'Mettre à jour' : 'Enregistrer'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <style jsx="true">{`
                .view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .header-title-section h2 { margin: 0; font-size: 1.5rem; font-weight: 800; color: #1e293b; }
                .header-title-section p { margin: 4px 0 0 0; color: #64748b; font-size: 0.9rem; }
                .add-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; font-weight: 600; }

                /* Table styles */
                .table-wrapper { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
                .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
                .admin-table th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; color: #64748b; border-bottom: 1px solid #e2e8f0; }
                .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .table-img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; }
                .name-fr { font-weight: 600; color: #1e293b; }
                .name-ar { font-size: 0.9rem; color: #64748b; font-family: 'Inter', sans-serif; }

                .action-btns { display: flex; gap: 8px; }
                .icon-btn { 
                    width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0; 
                    background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s;
                }
                .icon-btn.edit:hover { border-color: var(--accent); color: var(--accent); background: #fdfbf7; }
                .icon-btn.delete:hover { border-color: #ef4444; color: #ef4444; background: #fff1f2; }

                /* Mobile View Utilities */
                .desktop-only { display: block; }
                .mobile-only { display: none; }

                /* Mobile Cards */
                .category-mobile-card {
                    background: white; border-radius: 16px; padding: 1rem;
                    border: 1px solid #e2e8f0; margin-bottom: 1rem;
                }
                .card-top { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
                .card-img { width: 60px; height: 60px; border-radius: 12px; object-fit: cover; }
                .card-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
                .card-name-fr { margin: 0; font-size: 1rem; font-weight: 700; color: #1e293b; }
                .card-name-ar { font-size: 0.85rem; color: #64748b; }
                .card-actions { display: flex; gap: 0.5rem; border-top: 1px solid #f1f5f9; padding-top: 0.75rem; }
                .mobile-action-btn { 
                    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 10px; border-radius: 8px; font-size: 0.9rem; font-weight: 600;
                    cursor: pointer; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569;
                }
                .delete-action { flex: 0 0 50px; color: #ef4444; border-color: #fee2e2; background: #fff1f2; }

                /* Form layout */
                .premium-form { background: white; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; max-width: 650px; margin: 0 auto; }
                .form-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
                .back-btn { display: flex; align-items: center; gap: 8px; background: none; border: none; color: #64748b; cursor: pointer; font-weight: 600; }
                .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
                .input-group { display: flex; flex-direction: column; gap: 8px; }
                .input-group label { font-size: 0.85rem; font-weight: 600; color: #475569; }
                .input-group input { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; }
                .input-group input:focus { border-color: var(--accent); outline: none; }
                .arabic-input input { text-align: right; }

                .image-section { margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; background: #f8fafc; padding: 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; }
                .upload-box { 
                    display: flex; flex-direction: column; align-items: center; gap: 8px; 
                    color: #64748b; cursor: pointer; transition: 0.2s;
                }
                .upload-box:hover { color: var(--accent); }
                .upload-box input { display: none; }
                .single-preview { position: relative; width: 120px; height: 120px; }
                .single-preview img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                .remove-preview { position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

                .form-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #f1f5f9; }
                .btn-ghost { background: #f8fafc; color: #64748b; }
                .submit-btn { display: flex; align-items: center; gap: 8px; padding: 14px 32px; font-weight: 700; }

                @media (max-width: 768px) {
                    .desktop-only { display: none; }
                    .mobile-only { display: block; }
                    .input-row { grid-template-columns: 1fr; }
                    .add-btn span { display: none; }
                    .add-btn { height: 48px; border-radius: 12px; padding: 0 16px; }
                    .premium-form { padding: 1.5rem; }
                    .form-footer { flex-direction: column-reverse; }
                    .btn { width: 100%; justify-content: center; }
                }

                .loading-state { display: flex; flex-direction: column; align-items: center; padding: 5rem; color: #64748b; }
                .spinner { animation: spin 1s linear infinite; margin-bottom: 1rem; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.4s ease forwards; }
                .empty-state { text-align: center; padding: 4rem; color: #94a3b8; }
            `}</style>
        </div>
    );
};

export default ManageCategories;
