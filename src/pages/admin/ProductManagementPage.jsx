import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Eye,
  X,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const ProductManagementPage = () => {
  const { admin } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState(initialFilter);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectModalProduct, setRejectModalProduct] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'vegetables',
    description: '',
    price: '',
    unit: 'kg',
    availableQuantity: 50,
    grade: 'Grade A',
    organicStatus: 'Naturally Grown',
    farmLocation: 'Regional Agro Hub',
    image: '',
    supplierVerified: false
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const prodList = await api.getAllProductsAdmin();
      setProducts(prodList);
      const catList = await api.getCategories();
      setCategories(catList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (product) => {
    try {
      const res = await api.adminApproveProduct(product.id, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedback({ type: 'success', text: `Product "${product.name}" approved and published to customer marketplace.` });
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Approval failed.' });
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please specify why this product is being rejected or needs modification.');
      return;
    }
    try {
      const res = await api.adminRejectProduct(rejectModalProduct.id, rejectReason, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedback({ type: 'success', text: `Product "${rejectModalProduct.name}" rejected. Feedback sent to farmer.` });
        setRejectModalProduct(null);
        setRejectReason('');
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Action failed.' });
    }
  };

  const handleToggleSupplier = async (product) => {
    try {
      const res = await api.adminToggleSupplierVerification(product.id);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: res.message || 'Supplier verification status updated.'
        });
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to update supplier verification.' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteReason.trim()) {
      alert('Please state justification for permanent removal.');
      return;
    }
    try {
      const res = await api.adminRemoveProduct(deleteModalProduct.id, deleteReason, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedback({ type: 'success', text: `Listing removed permanently.` });
        setDeleteModalProduct(null);
        setDeleteReason('');
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Deletion failed.' });
    }
  };

  const handleCreateCatalogueProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price) {
      alert('Please specify product name and price.');
      return;
    }
    setCreatingProduct(true);
    try {
      const selectedCatObj = categories.find((c) => c.slug === newProduct.category);
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        availableQuantity: Number(newProduct.availableQuantity) || 50,
        categoryName: selectedCatObj?.name || newProduct.category,
        image:
          newProduct.image.trim() ||
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
      };
      const res = await api.adminCreateProduct(payload);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Catalogue product "${newProduct.name}" added to MongoDB collection.`
        });
        setCreateModalOpen(false);
        setNewProduct({
          name: '',
          category: categories[0]?.slug || 'vegetables',
          description: '',
          price: '',
          unit: 'kg',
          availableQuantity: 50,
          grade: 'Grade A',
          organicStatus: 'Naturally Grown',
          farmLocation: 'Regional Agro Hub',
          image: '',
          supplierVerified: false
        });
        loadData();
      } else {
        setFeedback({ type: 'error', text: res.message || 'Creation failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Creation failed' });
    } finally {
      setCreatingProduct(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (p.name || '').toLowerCase().includes(term) ||
      (p.farmerDisplayName || '').toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term);

    let matchesCat = true;
    if (selectedCategory !== 'All') {
      matchesCat =
        (p.category || '').toLowerCase() === selectedCategory.toLowerCase() ||
        (p.category || '').toLowerCase() === categories.find((c) => c.id === selectedCategory)?.slug.toLowerCase();
    }

    let matchesStatus = true;
    if (statusFilter === 'Catalogue') {
      matchesStatus = p.isCatalogue === true;
    } else if (statusFilter === 'Farmer') {
      matchesStatus = !p.isCatalogue;
    } else if (statusFilter === 'Pending') {
      matchesStatus = p.approvalStatus === 'Pending' || p.approvalStatus === 'Under Review';
    } else if (statusFilter === 'Active') {
      matchesStatus = p.status === 'Active' && p.approvalStatus !== 'Pending';
    } else if (statusFilter === 'OutOfStock') {
      matchesStatus = (p.stock || p.availableQuantity || p.quantity || 0) <= 0;
    } else if (statusFilter === 'Rejected') {
      matchesStatus = p.approvalStatus === 'Rejected';
    }

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-emerald-400" />
            Product Moderation & Catalog Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming agricultural listings, enforce organic quality assurance, and moderate pricing standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total Listings:</span>
            <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              {products.length} Products
            </span>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Catalogue Item</span>
          </button>
        </div>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by product name, producer, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['All', 'Catalogue', 'Farmer', 'Pending', 'Active', 'OutOfStock', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setSearchParams(status === 'All' ? {} : { filter: status });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === status
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {status === 'OutOfStock' ? 'Out of Stock' : status === 'Catalogue' ? 'Farm Catalogue' : status === 'Farmer' ? 'Farmer Harvests' : status}
                {status === 'Pending' && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px]">
                    {products.filter((p) => p.approvalStatus === 'Pending' || p.approvalStatus === 'Under Review').length}
                  </span>
                )}
                {status === 'Catalogue' && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                    {products.filter((p) => p.isCatalogue).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Item & Visual</th>
                <th className="py-3.5 px-4">Producer / Farm</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Unit</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Moderation Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isPending = p.approvalStatus === 'Pending' || p.approvalStatus === 'Under Review';
                  const isApproved = p.approvalStatus === 'Approved' || (p.status === 'Active' && !p.approvalStatus);
                  const isRejected = p.approvalStatus === 'Rejected';
                  const isLowStock = (p.stock || p.quantity || 0) <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white">{p.name}</div>
                            <div className="text-[10px] text-slate-400">ID: {p.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {p.isCatalogue ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                              <Sparkles className="w-2.5 h-2.5" /> Catalogue Reference
                            </span>
                            <div className="text-[11px] text-slate-300 mt-1 font-medium">{p.farmLocation || 'Regional Cooperative'}</div>
                            {p.grade && <div className="text-[10px] text-slate-500">Grade: {p.grade}</div>}
                          </div>
                        ) : (
                          <div>
                            <div className="text-slate-200 font-medium">{p.farmerDisplayName || p.farmerName || 'Farmer Listing'}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{p.farmerId || 'farmer'}</div>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white font-mono">₹{p.price}</span>
                        <span className="text-[10px] text-slate-500"> / {p.unit || 'kg'}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold font-mono ${
                            isLowStock ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {p.stock !== undefined ? p.stock : (p.quantity || 0)} {p.unit || 'kg'}
                        </span>
                        {isLowStock && (
                          <div className="text-[9px] text-rose-500 font-semibold uppercase">Out of Stock</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {p.isCatalogue ? (
                          <button
                            onClick={() => handleToggleSupplier(p)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold border transition cursor-pointer ${
                              p.supplierVerified
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                            }`}
                            title="Click to toggle supplier verification (allows/blocks customer order checkout)"
                          >
                            {p.supplierVerified ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>Supplier Verified (Orderable)</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>Unverified (Display Only)</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isApproved
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : isRejected
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                            }`}
                          >
                            {isApproved && <CheckCircle2 className="w-3 h-3" />}
                            {isRejected && <XCircle className="w-3 h-3" />}
                            {isPending && <AlertTriangle className="w-3 h-3" />}
                            {isApproved ? 'Approved' : (isRejected ? 'Rejected' : 'Pending Review')}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {isPending && (
                            <button
                              onClick={() => handleApprove(p)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] transition"
                            >
                              Approve
                            </button>
                          )}

                          {isPending && (
                            <button
                              onClick={() => {
                                setRejectModalProduct(p);
                                setRejectReason('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold text-[10px] transition"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setDeleteModalProduct(p);
                              setDeleteReason('');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
                            title="Remove Prohibited Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Product Detail View */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedProduct.name}
                    {selectedProduct.isCatalogue && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                        Catalogue
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedProduct.farmerDisplayName || selectedProduct.farmerName || 'Cooperative'} &bull; Category: {selectedProduct.category}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Listing Price</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">₹{selectedProduct.price} / {selectedProduct.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Stock Available</span>
                  <span className="font-mono text-white text-sm">{selectedProduct.stock || selectedProduct.availableQuantity || selectedProduct.quantity || 0} {selectedProduct.unit || 'units'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Farming / Quality</span>
                  <span className="text-slate-200">{selectedProduct.grade || (selectedProduct.isOrganic ? 'Certified Organic' : 'Natural Produce')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Origin / Region</span>
                  <span className="text-slate-200">{selectedProduct.farmLocation || selectedProduct.harvestDate || 'Regional Farm Hub'}</span>
                </div>
              </div>

              {selectedProduct.isCatalogue && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-white block">Supplier Verification</span>
                    <span className="text-[10px] text-slate-400">
                      {selectedProduct.supplierVerified
                        ? 'Verified regional supplier connected. Customers can order.'
                        : 'Unverified reference listing. Visible for market discovery but blocked from checkout.'}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await handleToggleSupplier(selectedProduct);
                      setSelectedProduct((prev) => ({ ...prev, supplierVerified: !prev.supplierVerified }));
                    }}
                    className={`px-3 py-1 rounded-xl text-[10px] font-semibold border transition ${
                      selectedProduct.supplierVerified
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    {selectedProduct.supplierVerified ? 'Verified' : 'Unverified'}
                  </button>
                </div>
              )}

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Description:</span>
                <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedProduct.description || 'Pesticide-free produce grown using heirloom non-GMO seeds and clean irrigation.'}
                </p>
              </div>

              {selectedProduct.rejectionReason && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300">
                  <span className="font-bold block text-[11px] mb-0.5">Rejection / Moderator Notes:</span>
                  <p>{selectedProduct.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Reject Listing */}
      {rejectModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white mb-1">Reject Listing: {rejectModalProduct.name}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Explain why this listing is being rejected or needs detail adjustments:
            </p>

            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Inaccurate pricing unit or missing organic accreditation claim documentation..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalProduct(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Remove Listing */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Remove Prohibited Product</h3>
            <p className="text-xs text-slate-400 mb-4">
              Permanently deleting <span className="text-white font-medium">"{deleteModalProduct.name}"</span> from the database. Enter regulatory justification:
            </p>

            <textarea
              rows="3"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="e.g. Prohibited non-food or unauthorized pesticide claims reported..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalProduct(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Catalogue Commodity */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Catalogue Commodity</h3>
                  <p className="text-[11px] text-slate-400">Populate standard agricultural reference record into MongoDB</p>
                </div>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCatalogueProduct} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Alphonso Mango"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="e.g. 120"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Unit *</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="kg">kg</option>
                    <option value="gram">gram</option>
                    <option value="litre">litre</option>
                    <option value="piece">piece</option>
                    <option value="bunch">bunch</option>
                    <option value="dozen">dozen</option>
                    <option value="box">box</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.availableQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, availableQuantity: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Quality Grade</label>
                  <input
                    type="text"
                    value={newProduct.grade}
                    onChange={(e) => setNewProduct({ ...newProduct, grade: e.target.value })}
                    placeholder="e.g. Grade A+ / Premium"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Organic Status</label>
                  <input
                    type="text"
                    value={newProduct.organicStatus}
                    onChange={(e) => setNewProduct({ ...newProduct, organicStatus: e.target.value })}
                    placeholder="e.g. 100% Certified Organic"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Farm Origin / Region</label>
                <input
                  type="text"
                  value={newProduct.farmLocation}
                  onChange={(e) => setNewProduct({ ...newProduct, farmLocation: e.target.value })}
                  placeholder="e.g. Ratnagiri, Maharashtra"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Produce description, freshness traits, storage recommendations..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="supplierVerified"
                  checked={newProduct.supplierVerified}
                  onChange={(e) => setNewProduct({ ...newProduct, supplierVerified: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="supplierVerified" className="text-xs text-slate-300 cursor-pointer">
                  Supplier Verified immediately (Enables customer checkout for this item)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProduct}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition shadow-md shadow-emerald-950/30"
                >
                  {creatingProduct ? 'Saving...' : 'Add to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

