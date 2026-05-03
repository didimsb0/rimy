import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit2,
    Trash2,
    ArrowLeft,
    Check,
    AlertCircle,
    Loader2,
    Percent,
    Globe,
    Tags,
    Package,
} from 'lucide-react';

const SCOPE_OPTIONS = [
    { value: 'all', label: 'Tous les produits', icon: <Globe size={16} /> },
    { value: 'category', label: 'Une catégorie', icon: <Tags size={16} /> },
    { value: 'product', label: 'Un produit', icon: <Package size={16} /> },
];

const ManageDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        scope: 'all',
        category: '',
        product: '',
        percentage: 10,
        isActive: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const [d, c, p] = await Promise.all([
                axios.get(`${apiUrl}/api/discounts`),
                axios.get(`${apiUrl}/api/categories`),
                axios.get(`${apiUrl}/api/products`),
            ]);
            setDiscounts(d.data);
            setCategories(c.data);
            setProducts(p.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', scope: 'all', category: '', product: '', percentage: 10, isActive: true });
        setEditing(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = import.meta.env.VITE_API_URL;
        const payload = {
            name: formData.name,
            scope: formData.scope,
            category: formData.scope === 'category' ? formData.category : null,
            product: formData.scope === 'product' ? formData.product : null,
            percentage: Number(formData.percentage),
            isActive: formData.isActive,
        };

        try {
            if (editing) {
                await axios.put(`${apiUrl}/api/discounts/${editing._id}`, payload);
            } else {
                await axios.post(`${apiUrl}/api/discounts`, payload);
            }
            resetForm();
            fetchData();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (d) => {
        setEditing(d);
        setFormData({
            name: d.name || '',
            scope: d.scope,
            category: d.category?._id || '',
            product: d.product?._id || '',
            percentage: d.percentage,
            isActive: d.isActive,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette réduction ?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/discounts/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleActive = async (d) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/discounts/${d._id}`, {
                ...d,
                category: d.category?._id || null,
                product: d.product?._id || null,
                isActive: !d.isActive,
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const describeScope = (d) => {
        if (d.scope === 'all') return 'Tous les produits';
        if (d.scope === 'category') return `Catégorie : ${d.category?.name_fr || '—'}`;
        if (d.scope === 'product') return `Produit : ${d.product?.name_fr || '—'}`;
        return '';
    };

    if (loading && discounts.length === 0) {
        return (
            <div className="loading-state">
                <Loader2 className="spinner" size={40} />
                <p>Chargement des réductions...</p>
            </div>
        );
    }

    return (
        <div className="manage-container">
            {!showForm ? (
                <div className="list-view">
                    <div className="view-header">
                        <div className="header-title-section">
                            <h2>Réductions</h2>
                            <p>{discounts.length} réduction(s) configurée(s)</p>
                        </div>
                        <button className="btn btn-accent add-btn" onClick={() => setShowForm(true)}>
                            <Plus size={18} />
                            <span>Nouvelle réduction</span>
                        </button>
                    </div>

                    <div className="info-banner">
                        <Percent size={18} />
                        <div>
                            <strong>Règle de priorité :</strong> une réduction sur un <em>produit</em> spécifique a priorité sur une réduction de <em>catégorie</em>, qui a priorité sur une réduction <em>globale</em>. Le client voit toujours la plus spécifique.
                        </div>
                    </div>

                    {discounts.length === 0 ? (
                        <div className="empty-state">
                            <AlertCircle size={40} />
                            <p>Aucune réduction. Créez-en une pour commencer.</p>
                        </div>
                    ) : (
                        <div className="discounts-grid">
                            {discounts.map(d => (
                                <div key={d._id} className={`discount-card ${!d.isActive ? 'inactive' : ''}`}>
                                    <div className="discount-percent">
                                        <span className="num">-{d.percentage}</span>
                                        <span className="sym">%</span>
                                    </div>
                                    <div className="discount-body">
                                        {d.name && <h4>{d.name}</h4>}
                                        <div className="scope-line">
                                            {d.scope === 'all' && <Globe size={14} />}
                                            {d.scope === 'category' && <Tags size={14} />}
                                            {d.scope === 'product' && <Package size={14} />}
                                            <span>{describeScope(d)}</span>
                                        </div>
                                        <div className="status-line">
                                            <label className="toggle-mini">
                                                <input
                                                    type="checkbox"
                                                    checked={d.isActive}
                                                    onChange={() => toggleActive(d)}
                                                />
                                                <span className="slider-mini"></span>
                                                <span>{d.isActive ? 'Active' : 'Désactivée'}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="discount-actions">
                                        <button onClick={() => handleEdit(d)} className="icon-btn edit"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(d._id)} className="icon-btn delete"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="form-view fade-in">
                    <div className="form-header">
                        <button className="back-btn" onClick={resetForm}>
                            <ArrowLeft size={18} />
                            <span>Retour</span>
                        </button>
                        <h2>{editing ? 'Modifier la réduction' : 'Nouvelle réduction'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="premium-form">
                        <div className="input-group">
                            <label>Nom (optionnel)</label>
                            <input
                                type="text"
                                placeholder="Ex : Soldes Ramadan"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>S'applique à</label>
                            <div className="scope-options">
                                {SCOPE_OPTIONS.map(opt => (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        className={`scope-btn ${formData.scope === opt.value ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, scope: opt.value, category: '', product: '' })}
                                    >
                                        {opt.icon}
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.scope === 'category' && (
                            <div className="input-group">
                                <label>Catégorie</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c._id}>{c.name_fr}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {formData.scope === 'product' && (
                            <div className="input-group">
                                <label>Produit</label>
                                <select
                                    value={formData.product}
                                    onChange={e => setFormData({ ...formData, product: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner un produit</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.name_fr} ({p.price} MRU)</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="input-group">
                            <label>Pourcentage de réduction (%)</label>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={formData.percentage}
                                onChange={e => setFormData({ ...formData, percentage: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <span className="slider"></span>
                                <span className="toggle-label">Réduction active</span>
                            </label>
                        </div>

                        <div className="form-footer">
                            <button type="button" className="btn btn-ghost" onClick={resetForm}>Annuler</button>
                            <button type="submit" className="btn btn-accent submit-btn">
                                <Check size={18} />
                                <span>{editing ? 'Mettre à jour' : 'Créer'}</span>
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

                .info-banner {
                    display: flex; gap: 12px; align-items: flex-start;
                    background: #fdfbf7; border: 1px solid #f1e6c5;
                    color: #78581a; padding: 1rem 1.25rem; border-radius: 12px;
                    margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.5;
                }
                .info-banner svg { color: var(--accent); flex-shrink: 0; margin-top: 2px; }

                .discounts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.25rem;
                }
                .discount-card {
                    background: white; border: 1px solid #e2e8f0; border-radius: 16px;
                    padding: 1.25rem; display: flex; gap: 1rem; align-items: center;
                    transition: 0.2s;
                }
                .discount-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.04); }
                .discount-card.inactive { opacity: 0.55; }
                .discount-percent {
                    background: linear-gradient(135deg, #d4af37, #b8932a);
                    color: white; min-width: 70px; height: 70px; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; flex-shrink: 0;
                }
                .discount-percent .num { font-size: 1.4rem; }
                .discount-percent .sym { font-size: 1rem; margin-left: 1px; }
                .discount-body { flex: 1; min-width: 0; }
                .discount-body h4 { margin: 0 0 6px 0; font-size: 1rem; color: #1e293b; }
                .scope-line { display: flex; align-items: center; gap: 6px; color: #64748b; font-size: 0.85rem; margin-bottom: 8px; }
                .status-line { font-size: 0.8rem; }
                .toggle-mini { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; color: #64748b; }
                .toggle-mini input { display: none; }
                .slider-mini { position: relative; width: 30px; height: 16px; background: #cbd5e1; border-radius: 20px; transition: 0.2s; }
                .slider-mini:before { content: ""; position: absolute; height: 12px; width: 12px; left: 2px; top: 2px; background: white; border-radius: 50%; transition: 0.2s; }
                .toggle-mini input:checked + .slider-mini { background: #10b981; }
                .toggle-mini input:checked + .slider-mini:before { transform: translateX(14px); }
                .discount-actions { display: flex; flex-direction: column; gap: 6px; }
                .icon-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .icon-btn.edit { color: #4f46e5; }
                .icon-btn.delete { color: #ef4444; border-color: #fee2e2; background: #fff1f2; }

                .premium-form { background: white; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; max-width: 720px; }
                .form-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
                .form-header h2 { margin: 0; font-size: 1.4rem; color: #1e293b; }
                .back-btn { display: flex; align-items: center; gap: 8px; background: none; border: none; color: #64748b; cursor: pointer; font-weight: 600; }
                .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
                .input-group label { font-size: 0.85rem; font-weight: 600; color: #475569; }
                .input-group input, .input-group select { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-family: inherit; font-size: 0.95rem; transition: border-color 0.2s; }
                .input-group input:focus, .input-group select:focus { border-color: var(--accent); outline: none; }

                .scope-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                .scope-btn {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 14px 10px; border: 2px solid #e2e8f0; background: white;
                    border-radius: 12px; cursor: pointer; font-family: inherit; font-size: 0.9rem;
                    color: #475569; font-weight: 500; transition: 0.2s;
                }
                .scope-btn:hover { border-color: #cbd5e1; }
                .scope-btn.active { border-color: var(--accent); background: #fdfbf7; color: var(--accent); font-weight: 700; }

                .toggle { display: flex; align-items: center; gap: 12px; cursor: pointer; }
                .slider { position: relative; width: 34px; height: 18px; background: #e2e8f0; border-radius: 20px; transition: 0.3s; }
                .slider:before { content: ""; position: absolute; height: 12px; width: 12px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
                input:checked + .slider { background: var(--accent); }
                input:checked + .slider:before { transform: translateX(16px); }
                .toggle-label { font-size: 0.9rem; font-weight: 500; color: #475569; }

                .form-footer { margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem; }
                .btn-ghost { background: #f8fafc; color: #64748b; }
                .submit-btn { display: flex; align-items: center; gap: 8px; padding: 14px 32px; font-weight: 700; }

                .empty-state { text-align: center; padding: 3rem; color: #94a3b8; background: white; border-radius: 16px; border: 1px dashed #e2e8f0; }
                .empty-state svg { margin-bottom: 1rem; }

                .loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem; color: #64748b; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spinner { animation: spin 1s linear infinite; }

                @media (max-width: 1024px) {
                    .add-btn span { display: none; }
                    .add-btn { height: 48px; border-radius: 12px; padding: 0 12px; }
                    .premium-form { padding: 1.25rem; border-radius: 12px; }
                    .scope-options { grid-template-columns: 1fr; }
                    .form-footer { flex-direction: column-reverse; }
                    .btn { width: 100%; justify-content: center; }
                }
            `}</style>
        </div>
    );
};

export default ManageDiscounts;
