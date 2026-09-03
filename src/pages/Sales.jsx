import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import Modal from '../components/common/Modal.jsx';
import VoiceInputButton from '../components/common/VoiceInputButton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import {
  TrendingUp,
  PlusCircle,
  Search,
  Calendar,
  DollarSign,
  User,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';

const Sales = () => {
  const { t } = useLanguage();
  const { sales, addSale, products } = useBusiness();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productName: 'Avakaya (Mango) Pickle - 1kg',
    quantity: 5,
    amount: 900,
    customer: 'Local Retailer',
    paymentMethod: 'UPI'
  });

  const totalSalesAmount = sales.reduce((acc, s) => acc + Number(s.amount || 0), 0);

  const filteredSales = sales.filter((s) =>
    (s.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.customer || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addSale(formData);
    setModalOpen(false);
    setFormData({
      productName: 'Avakaya (Mango) Pickle - 1kg',
      quantity: 5,
      amount: 900,
      customer: 'Local Retailer',
      paymentMethod: 'UPI'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.nav?.sales || 'Sales Tracking'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record every customer order and track income in real time
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm self-start sm:self-auto transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.dashboard?.logSale || 'Log New Sale'}</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Recorded Sales Volume
          </span>
          <h3 className="text-3xl font-black text-emerald-900 mt-1">
            {formatCurrency(totalSalesAmount)}
          </h3>
          <p className="text-xs text-emerald-700 mt-0.5">{sales.length} transactions recorded</p>
        </div>
        <div className="p-3 bg-emerald-100/80 text-emerald-700 rounded-2xl">
          <ArrowUpRight className="w-8 h-8" />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product or customer name..."
          className="flex-1 text-xs sm:text-sm bg-transparent outline-none font-medium"
        />
      </div>

      {/* Sales List */}
      {filteredSales.length === 0 ? (
        <EmptyState
          title="No sales found"
          description="Log your first sale to start tracking your daily revenue."
          actionLabel="Log a Sale Now"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Quantity</th>
                  <th className="p-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {filteredSales.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{s.productName}</td>
                    <td className="p-4">{s.customer || 'Direct Retail'}</td>
                    <td className="p-4 text-slate-400">{formatDate(s.date)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[11px] font-semibold">
                        {s.paymentMethod || 'Cash'}
                      </span>
                    </td>
                    <td className="p-4 text-right">{s.quantity}</td>
                    <td className="p-4 text-right font-black text-emerald-700">{formatCurrency(s.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Sale Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log New Sale Record"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product</label>
            <select
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
            >
              {products.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name} ({formatCurrency(p.sellingPrice)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => {
                  const q = Number(e.target.value);
                  setFormData({ ...formData, quantity: q, amount: q * 180 });
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Amount (₹)</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Customer Name</span>
              <VoiceInputButton
                onTranscript={(text) => setFormData({ ...formData, customer: text })}
                className="p-1"
              />
            </label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              placeholder="e.g. Weekly Santalu Customer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
            >
              <option value="UPI / PhonePe">UPI / PhonePe / GPay</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit / Khata">Credit / Khata</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            Save Sale
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;
