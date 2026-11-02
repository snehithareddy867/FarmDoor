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
  X
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function FarmerInventoryPage() {
  const { farmer } = useFarmerAuth();
  const [products, setProducts] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stock update modal state
  const [updateModalProduct, setUpdateModalProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [updateReason, setUpdateReason] = useState('Fresh morning harvest batch');

  const fetchInventory = async () => {
    if (!farmer?.id) return;
    setLoading(true);
    const [p, h] = await Promise.all([
      api.getFarmerProducts(farmer.id),
      api.getStockHistory(farmer.id)
    ]);
    setProducts(p || []);
    setStockHistory(h || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, [farmer?.id]);

  const handleOpenStockModal = (prod) => {
    setUpdateModalProduct(prod);
    setNewQuantity(prod.availableQuantity);
    setUpdateReason('Fresh harvest batch');
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!updateModalProduct) return;
    await api.updateStockWithHistory(
      updateModalProduct.id,
      Number(newQuantity),
      updateReason,
      farmer.id
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const isLow = p.availableQuantity <= 5;
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
                  {isLow && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Low Stock</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#081c15]">{p.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Harvest: {p.harvestDate || 'Recent'}</p>

                <div className="mt-4 p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">Available Stock</span>
                    <span className="text-2xl font-black text-[#2d6a4f]">{p.availableQuantity}</span>
                    <span className="text-xs text-gray-600 ml-1 font-medium">{p.unit}</span>
                  </div>
                  <span className="text-xs font-bold text-[#081c15]">₹{p.price}/{p.unit}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
                <button
                  onClick={() => handleOpenStockModal(p)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition"
                >
                  Update Harvest Qty
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
                  <th className="pb-3 font-bold">Reason / Audit Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#faf8f2]">
                    <td className="py-3 text-gray-500">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="py-3 font-bold text-[#081c15]">{item.productName || item.productId}</td>
                    <td className="py-3 text-gray-600">{item.oldStock}</td>
                    <td className="py-3 font-bold text-[#2d6a4f]">{item.newStock}</td>
                    <td className="py-3 text-gray-700">{item.reason}</td>
                  </tr>
                ))}
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

