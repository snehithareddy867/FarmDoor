import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Package,
  Carrot,
  Apple,
  Milk,
  Wheat,
  Droplets,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const CategoryManagementPage = () => {
  const { admin } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'Carrot',
    description: '',
    active: true
  });

  const [feedback, setFeedback] = useState(null);
  const [deleteErrorModal, setDeleteErrorModal] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      slug: '',
      icon: 'Carrot',
      description: '',
      active: true
    });
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (cat) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || 'Carrot',
      description: cat.description || '',
      active: cat.active !== undefined ? cat.active : true
    });
    setEditingCategory(cat);
    setShowAddModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please provide a category title.');
      return;
    }

    try {
      if (editingCategory) {
        const res = await api.adminUpdateCategory(editingCategory.id, formData, `${admin?.name} (${admin?.role})`);
        if (res.success) {
          setFeedback({ type: 'success', text: `Category "${formData.name}" updated successfully.` });
        }
      } else {
        const res = await api.adminAddCategory(formData, `${admin?.name} (${admin?.role})`);
        if (res.success) {
          setFeedback({ type: 'success', text: `Category "${formData.name}" created successfully.` });
        } else {
          alert(res.message || 'Failed to create category');
          return;
        }
      }
      setShowAddModal(false);
      loadCategories();
    } catch (err) {
      alert('Error saving category');
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      const res = await api.adminToggleCategoryStatus(cat.id, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Category "${cat.name}" is now ${res.category.active ? 'visible' : 'hidden'}.`
        });
        loadCategories();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to toggle status.' });
    }
  };

  const handleDelete = async (cat) => {
    const confirmed = window.confirm(`Are you sure you want to delete category "${cat.name}"?`);
    if (!confirmed) return;

    try {
      const res = await api.adminDeleteCategory(cat.id, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedback({ type: 'success', text: `Category "${cat.name}" deleted.` });
        loadCategories();
      } else {
        // STRICT BLOCK: show modal with dependent count
        setDeleteErrorModal({
          categoryName: cat.name,
          error: res.error,
          count: res.count,
          dependentProducts: res.dependentProducts || []
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Error executing deletion.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-emerald-400" />
            Category & Produce Taxonomy Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize the marketplace catalog structure. Strict validation protects categories from accidental deletion while active listings exist.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Category Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition flex flex-col justify-between ${
              cat.active ? 'border-slate-800' : 'border-slate-800/60 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`p-1.5 rounded-lg text-[10px] transition ${
                      cat.active
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 hover:text-white'
                    }`}
                    title={cat.active ? 'Visible on Storefront' : 'Hidden from Storefront'}
                  >
                    {cat.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Edit Metadata"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="font-bold text-white text-base">{cat.name}</h3>
                <span className="font-mono text-[11px] text-slate-400">/{cat.slug}</span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {cat.description || 'Natural agricultural classification.'}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-white font-mono">{cat.productCount || 0}</span> live products
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                cat.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {cat.active ? 'Active' : 'Hidden'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Create New Category'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Cold-Pressed Oils"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, '-');
                    setFormData({ ...formData, name, slug: editingCategory ? formData.slug : slug });
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL Identifier Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cold-pressed-oils"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Crop Scope</label>
                <textarea
                  rows="3"
                  placeholder="Explain varieties covered under this classification..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-800 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="activeToggle" className="text-slate-300 font-medium">
                  Publish category to consumer storefront filters
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-950/40"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STRICT DELETION GUARD MODAL */}
      {deleteErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">Category Deletion Blocked</h3>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 mb-4 leading-relaxed">
              {deleteErrorModal.error}
            </div>

            <p className="text-xs text-slate-400 mb-3">
              To preserve catalog integrity and avoid dangling product records, active products must be reclassified or deleted before removing <strong className="text-white">"{deleteErrorModal.categoryName}"</strong>.
            </p>

            {deleteErrorModal.dependentProducts && deleteErrorModal.dependentProducts.length > 0 && (
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Sample Dependent Listings ({deleteErrorModal.count}):
                </span>
                <div className="max-h-28 overflow-y-auto space-y-1 p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono">
                  {deleteErrorModal.dependentProducts.slice(0, 6).map((dp) => (
                    <div key={dp.id} className="truncate">• {dp.name} ({dp.id})</div>
                  ))}
                  {deleteErrorModal.count > 6 && (
                    <div className="text-slate-500 text-[10px] italic">...and {deleteErrorModal.count - 6} more</div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setDeleteErrorModal(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

