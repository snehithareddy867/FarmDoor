import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Minus, 
  Save, 
  History,
  X,
  TrendingDown,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';
import { handleImageError } from '../../utils/imageFallback';

export default function FarmerInventoryPage() {
  const { farmer } = useFarmerAuth();
  const [products, setProducts] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stock update modal state
  const [updateModalProduct, setUpdateModalProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [updateReason, setUpdateReason] = useState('Fresh morning harvest batch');

  const farmerIdentifier = farmer?.farmerId || farmer?.id || farmer?._id;

  const fetchInventory = async () => {
    if (!farmerIdentifier) return;
    setLoading(true);
    const [p, h] = await Promise.all([
      api.getFarmerProducts(farmerIdentifier),
      api.getStockHistory(farmerIdentifier)
    ]);
    setProducts(p || []);
    setStockHistory(h || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, [farmerIdentifier]);

  const handleOpenStockModal = (prod) => {
    setUpdateModalProduct(prod);
    setNewQuantity(prod.availableQuantity);
    setUpdateReason('Fresh morning harvest batch');
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!updateModalProduct) return;
    await api.updateStockWithHistory(
      updateModalProduct.id,
      Number(newQuantity),
      updateReason,
      farmerIdentifier
    );
    setUpdateModalProduct(null);
    fetchInventory();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Live Harvest Stock & Inventory Log
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit trail of harvest updates, local market allotments, and real-time inventory on the marketplace.
          </p>
        </div>
      </div>

      {/* Stock Cards Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#2d6a4f]/20 shadow-sm">
          <div className="w-14 h-14 rounded-3xl bg-[#faf8f2] text-[#2d6a4f] flex items-center justify-center mx-auto mb-4 border border-[#2d6a4f]/20">
            <Boxes className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#081c15]">No Crop Products Listed Yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
            List your seasonal harvests or link items from the Master Agricultural Catalogue to track stock levels, reserved customer orders, and harvest adjustments.
          </p>
          <a
            href="/farmer/products/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Harvest Crop</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const isLow = p.availableQuantity <= 5 && p.availableQuantity > 0;
            const isOut = p.availableQuantity <= 0;
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between hover:border-[#52b788] transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {p.category}
                    </span>
                    {isOut ? (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Out of Stock</span>
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Low Stock</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>In Stock</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                      alt={p.name}
                      onError={(e) => handleImageError(e, p.category || 'vegetables')}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#2d6a4f]/20 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[#081c15] line-clamp-1">{p.name}</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">Harvest: {p.harvestDate || 'Recent'}</p>
                      <span className="text-xs font-bold text-[#2d6a4f]">₹{p.price}/{p.unit}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] uppercase text-gray-500 font-bold">Available Stock</span>
                      <span className="text-xl font-black text-[#2d6a4f]">
                        {p.availableQuantity} <span className="text-xs font-medium text-gray-600">{p.unit}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                      <span>Sold: <strong className="text-[#081c15]">{p.soldQuantity ?? 0} {p.unit}</strong></span>
                      <span>Reserved: <strong className="text-amber-800">{p.reservedQuantity ?? 0} {p.unit}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Updated: {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Today'}</span>
                  <button
                    onClick={() => handleOpenStockModal(p)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition"
                  >
                    Update Stock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock History Audit Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
        <h2 className="text-base font-bold text-[#081c15] mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-[#2d6a4f]" />
          <span>Stock Audit Log History</span>
        </h2>

        {stockHistory.length === 0 ? (
          <p className="text-xs text-gray-500 py-4">No stock adjustments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-bold">Timestamp</th>
                  <th className="pb-3 font-bold">Crop Product</th>
                  <th className="pb-3 font-bold">Previous Qty</th>
                  <th className="pb-3 font-bold">New Qty</th>
                  <th className="pb-3 font-bold">Adjustment</th>
                  <th className="pb-3 font-bold">Reason / Audit Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockHistory.map((item, idx) => {
                  const prev = item.previousQuantity ?? item.oldStock ?? 0;
                  const curr = item.newQuantity ?? item.newStock ?? 0;
                  const diff = item.changeQuantity !== undefined ? item.changeQuantity : (curr - prev);
                  const isPositive = diff >= 0;

                  return (
                    <tr key={item.id || idx} className="hover:bg-[#faf8f2]">
                      <td className="py-3 text-gray-500 font-mono text-[11px]">
                        {new Date(item.timestamp || item.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 font-bold text-[#081c15]">{item.productName || item.productId}</td>
                      <td className="py-3 text-gray-600">{prev} {item.unit || 'kg'}</td>
                      <td className="py-3 font-bold text-[#2d6a4f]">{curr} {item.unit || 'kg'}</td>
                      <td className="py-3 font-bold">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] ${
                          isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{isPositive ? `+${diff}` : diff} {item.unit || 'kg'}</span>
                        </span>
                      </td>
                      <td className="py-3 text-gray-700 max-w-xs">{item.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Quantity Modal */}
      {updateModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <h3 className="text-sm font-bold text-[#081c15]">Update Harvest Batch</h3>
              <button onClick={() => setUpdateModalProduct(null)} className="text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3 font-semibold">
              {updateModalProduct.name}
            </p>

            <form onSubmit={handleSaveStock} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  New Available Quantity ({updateModalProduct.unit})
                </label>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f2] border rounded-2xl focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Reason for Stock Adjustment</label>
                <select
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f2] border rounded-2xl focus:outline-none"
                >
                  <option value="Fresh morning harvest batch">Fresh morning harvest batch</option>
                  <option value="Sold at local farmer mandis">Sold at local farmer mandis</option>
                  <option value="Weather / field spoilage discard">Weather / field spoilage discard</option>
                  <option value="Physical crate inventory recount">Physical crate inventory recount</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateModalProduct(null)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#081c15] text-[#52b788] font-bold"
                >
                  Save & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

