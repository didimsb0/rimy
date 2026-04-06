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
    AlertCircle
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
        if (window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
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
            alert('Erreur lors de l\'enregistrement');
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
                        <h2>Toutes les Catégories</h2>
                        <button className="btn btn-accent add-btn" onClick={() => setShowForm(true)}>
                            <Plus size={18} />
                            <span>Nouvelle Catégorie</span>
                        </button>
                    </div>

                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Nom (FR)</th>
                                    <th>Nom (AR)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map(cat => (
                                        <tr key={cat._id}>
                                            <td>
                                                <img src={cat.image} alt={cat.name_fr} className="table-img" />
                                            </td>
                                            <td className="name-fr">{cat.name_fr}</td>
                                            <td className="name-ar" dir="rtl">{cat.name_ar}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button onClick={() => handleEdit(cat)} className="icon-btn edit" title="Modifier"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete(cat._id)} className="icon-btn delete" title="Supprimer"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="empty-state">
                                            <AlertCircle size={40} />
                                            <p>Aucune catégorie trouvée</p>
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
                        <h2>{editingCategory ? 'Modifier la Catégorie' : 'Créer une Catégorie'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="premium-form simple-form">
                        <div className="form-section">
                            <div className="input-group">
                                <label>Nom de la Catégorie (FR)</label>
                                <input
                                    type="text"
                                    value={formData.name_fr}
                                    onChange={e => setFormData({ ...formData, name_fr: e.target.value })}
                                    required
                                    placeholder="Ex: Parfums, Robes..."
                                />
                            </div>
                            <div className="input-group arabic-input">
                                <label>اسم الفئة (AR)</label>
                                <input
                                    type="text"
                                    value={formData.name_ar}
                                    onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                    required
                                    placeholder="اسم الفئة بالعربية"
                                    dir="rtl"
                                />
                            </div>
                            <div className="image-upload-zone">
                                <label className="upload-label">
                                    <ImageIcon size={32} />
                                    <span>Image de la catégorie</span>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </label>
                                {imagePreview && (
                                    <div className="single-preview">
                                        <img src={imagePreview} alt="preview" />
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-ghost" onClick={handleCancelForm}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-accent submit-btn">
                                    <Check size={18} />
                                    {editingCategory ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <style jsx="true">{`
                .manage-container { animation: fadeIn 0.3s ease; }
                
                .view-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .view-header h2 { margin: 0; font-size: 1.5rem; color: #1e293b; }

                .add-btn { display: flex; align-items: center; gap: 8px; padding: 12px 20px; font-weight: 600; }

                .table-wrapper {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                }

                .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
                .admin-table th {
                    background: #f8fafc;
                    padding: 1rem 1.5rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                }
                .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }

                .table-img { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; border: 1px solid #f1f5f9; }
                .name-fr { font-weight: 600; color: #1e293b; }
                .name-ar { font-family: 'Noto Sans Arabic', sans-serif; color: #64748b; }

                .action-btns { display: flex; gap: 8px; }
                .icon-btn {
                    width: 34px; height: 34px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    border: 1px solid #e2e8f0; background: white; cursor: pointer;
                    color: #64748b; transition: all 0.2s;
                }
                .icon-btn.edit:hover { border-color: var(--accent); color: var(--accent); background: #f8fafc; }
                .icon-btn.delete:hover { border-color: #ef4444; color: #ef4444; background: #fee2e2; }

                .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .back-btn { display: flex; align-items: center; gap: 8px; background: transparent; border: none; color: #64748b; cursor: pointer; font-weight: 600; }
                .form-header h2 { margin: 0; font-size: 1.5rem; }

                .premium-form {
                    background: white; padding: 2.5rem; border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;
                    max-width: 600px; margin: 0 auto;
                }

                .input-group { margin-bottom: 1.5rem; }
                .input-group label { display: block; font-size: 0.9rem; font-weight: 600; color: #475569; margin-bottom: 8px; }
                .input-group input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; }
                .input-group input:focus { border-color: var(--accent); outline: none; }

                .image-upload-zone {
                    background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px;
                    padding: 2rem; text-align: center; margin-bottom: 2rem;
                }
                .upload-label { cursor: pointer; display: flex; flex-direction: column; align-items: center; color: #64748b; }
                .upload-label input { display: none; }
                .single-preview { margin-top: 1.5rem; }
                .single-preview img { width: 120px; height: 120px; border-radius: 16px; object-fit: cover; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

                .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
                .btn-ghost { background: transparent; color: #64748b; border: 1px solid #e2e8f0; }

                .loading-state { display: flex; flex-direction: column; align-items: center; padding: 5rem; color: #64748b; }
                .spinner { animation: spin 1s linear infinite; margin-bottom: 1rem; }

                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.4s ease forwards; }

                .arabic-input input { text-align: right; font-family: 'Noto Sans Arabic', sans-serif; }
            `}</style>
        </div>
    );
};

export default ManageCategories;
