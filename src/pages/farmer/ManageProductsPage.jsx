import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Boxes,
  X,
  Filter,
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function ManageProductsPage() {
  const { farmer } = useFarmerAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Edit modal
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    unit: 'kg',
    availableQuantity: '',
    inStock: true,
    description: ''
  });

  const fetchProducts = async () => {
    if (!farmer?.id) return;
    setLoading(true);
    const p = await api.getFarmerProducts(farmer.id);
    setProducts(p || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [farmer?.id]);

  const handleToggleStock = async (product) => {
    const updatedStock = product.inStock ? 0 : 25;
    await api.updateFarmerProduct(product.id, {
      inStock: !product.inStock,
      availableQuantity: updatedStock,
      status: !product.inStock ? 'Active' : 'Inactive'
    });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this product from marketplace listings?')) {
      await api.deleteFarmerProduct(id);
      fetchProducts();
    }
  };

  const handleOpenEdit = (p) => {
    setEditProduct(p);
    setEditForm({
      name: p.name,
      price: p.price,
      unit: p.unit || 'kg',
      availableQuantity: p.availableQuantity !== undefined ? p.availableQuantity : (p.stock || 0),
      inStock: p.inStock,
      description: p.description || ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    await api.updateFarmerProduct(editProduct.id, {
      name: editForm.name,
      price: Number(editForm.price),
      unit: editForm.unit,
      availableQuantity: Number(editForm.availableQuantity),
      inStock: editForm.inStock && Number(editForm.availableQuantity) > 0,
      description: editForm.description,
      status: editForm.inStock ? 'Active' : 'Inactive'
    });
    setEditProduct(null);
    fetchProducts();
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            My Farm Produce Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Active crop catalogue listed directly on the consumer marketplace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crops..."
              className="pl-8 pr-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none w-36 sm:w-48"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="dairy">Dairy</option>
            <option value="grains">Grains</option>
            <option value="honey">Honey</option>
            <option value="spices">Spices</option>
          </select>

          <Link
            to="/farmer/products/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Crop</span>
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500 bg-white rounded-3xl border">
          <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Loading crops...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#2d6a4f]/20 shadow-sm">
          <p className="text-xs text-gray-500 mb-4">No crops match your search or filter.</p>
          <Link
            to="/farmer/products/add"
            className="px-4 py-2 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold"
          >
            List a New Crop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const isLowStock = (product.availableQuantity || product.stock || 0) <= 5;
            const isOutOfStock = !product.inStock || (product.availableQuantity || product.stock || 0) <= 0;
            const moderation = product.approvalStatus || (product.status === 'Active' ? 'Approved' : 'Pending');

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#2d6a4f]/20 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#52b788] transition"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#081c15]/80 text-[#74c69d] backdrop-blur-sm">
                        {product.category}
                      </span>
                      {/* Moderation Badge */}
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1 ${
                        moderation === 'Approved'
                          ? 'bg-emerald-900/90 text-emerald-300'
                          : moderation === 'Rejected'
                          ? 'bg-rose-900/90 text-rose-300'
                          : 'bg-amber-900/90 text-amber-300'
                      }`}>
                        {moderation === 'Approved' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                        {moderation}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleStock(product)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm transition ${
                          !isOutOfStock
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-rose-500 text-white border-rose-600'
                        }`}
                      >
                        {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-sm text-[#081c15] line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Harvest: {product.harvestDate || 'Fresh batch'}
                    </p>

                    {isLowStock && !isOutOfStock && (
                      <div className="mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Low stock alert ({product.availableQuantity} {product.unit} remaining)</span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-lg font-black text-[#2d6a4f]">
                        ₹{product.price} <span className="text-[10px] font-normal text-gray-500">/{product.unit}</span>
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        Stock: {product.availableQuantity !== undefined ? product.availableQuantity : product.stock} {product.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-[#faf8f2] border-t border-[#2d6a4f]/15 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="inline-flex items-center gap-1 font-bold text-[#2d6a4f] hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Listing</span>
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="inline-flex items-center gap-1 font-bold text-rose-600 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#2d6a4f]/20">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="text-base font-bold font-outfit text-[#081c15]">Edit Crop Listing</h3>
              <button onClick={() => setEditProduct(null)} className="p-1 hover:text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Crop Title</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Unit</label>
                  <select
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-xl"
                  >
                    <option value="kg">kg</option>
                    <option value="gram">gram</option>
                    <option value="litre">litre</option>
                    <option value="ml">ml</option>
                    <option value="piece">piece</option>
                    <option value="packet">packet</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Available Quantity / Stock</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editForm.availableQuantity}
                  onChange={(e) => setEditForm({ ...editForm, availableQuantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={editForm.inStock}
                  onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <label htmlFor="inStockCheck" className="text-gray-800 font-bold cursor-pointer">
                  Mark as Available on Storefront
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 rounded-xl border text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
