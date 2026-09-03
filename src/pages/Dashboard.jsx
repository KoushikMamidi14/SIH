import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { dashboardService } from '../services/api.js';
import { DEMO_CHART_DATA, DEMO_EXPENSE_PIE, DEMO_AI_INSIGHTS } from '../data/mockData.js';
import { formatCurrency, formatNumber } from '../utils/formatters.js';
import MetricCard from '../components/common/MetricCard.jsx';
import HealthScoreBadge from '../components/common/HealthScoreBadge.jsx';
import Modal from '../components/common/Modal.jsx';
import VoiceInputButton from '../components/common/VoiceInputButton.jsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Receipt,
  DollarSign,
  Sparkles,
  ShoppingBag,
  PlusCircle,
  Calculator,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  Circle,
  Store,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { t, currentLanguage } = useLanguage();
  const { business, sales, expenses, addSale, addExpense } = useBusiness();

  const [dashboardData, setDashboardData] = useState(null);
  const [actions, setActions] = useState([]);
  const [aiInsight, setAiInsight] = useState(null);

  // Quick action modals
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Form states for quick modals
  const [saleForm, setSaleForm] = useState({
    productName: 'Avakaya (Mango) Pickle - 1kg',
    quantity: 5,
    amount: 900,
    customer: 'Local Customer',
    paymentMethod: 'UPI'
  });

  const [expenseForm, setExpenseForm] = useState({
    category: 'Raw Materials',
    amount: 1500,
    description: 'Bulk cold-pressed sesame oil purchase'
  });

  useEffect(() => {
    const loadData = async () => {
      const res = await dashboardService.getDashboardData();
      if (res && res.data) {
        setDashboardData(res.data);
      }
    };
    loadData();

    // Load AI insight for active language
    const localized = DEMO_AI_INSIGHTS[currentLanguage] || DEMO_AI_INSIGHTS.en;
    setAiInsight(localized);
    setActions(localized.actions || []);
  }, [currentLanguage]);

  const toggleAction = (id) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    await addSale(saleForm);
    setSaleModalOpen(false);
    setSaleForm({
      productName: 'Avakaya (Mango) Pickle - 1kg',
      quantity: 5,
      amount: 900,
      customer: 'Local Customer',
      paymentMethod: 'UPI'
    });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    await addExpense(expenseForm);
    setExpenseModalOpen(false);
    setExpenseForm({
      category: 'Raw Materials',
      amount: 1500,
      description: 'Bulk raw supplies'
    });
  };

  const totalSales = business?.monthlySales || 35200;
  const totalExpenses = business?.monthlyExpenses || 21300;
  const netProfit = totalSales - totalExpenses;
  const healthScore = business?.healthScore || 84;

  return (
    <div className="space-y-8">
      {/* Top Banner: Business Info + Health Score */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
              {business?.category || 'Food Products'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {business?.location || 'Tenali, Andhra Pradesh'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {business?.name || 'Lakshmi Homemade Foods'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.dashboard?.subtitle || 'Real-time health, finances and daily action plan'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <HealthScoreBadge score={healthScore} />
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t.dashboard?.totalSales || 'Total Sales (Monthly)'}
          value={formatCurrency(totalSales)}
          subtitle="+14.2% from last month"
          icon={TrendingUp}
          trend={14.2}
          color="green"
        />

        <MetricCard
          title={t.dashboard?.totalExpenses || 'Total Expenses'}
          value={formatCurrency(totalExpenses)}
          subtitle="+3.8% from last month"
          icon={Receipt}
          trend={-3.8}
          color="orange"
        />

        <MetricCard
          title={t.dashboard?.netProfit || 'Net Profit'}
          value={formatCurrency(netProfit)}
          subtitle="Healthy 39.5% Net Margin"
          icon={DollarSign}
          trend={22.4}
          color="green"
        />

        <MetricCard
          title={t.dashboard?.healthScore || 'Health Score'}
          value={`${healthScore}/100`}
          subtitle={t.dashboard?.healthGood || 'Healthy & Growing'}
          icon={Sparkles}
          color="blue"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
          {t.dashboard?.quickActions || 'Quick Actions'}:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSaleModalOpen(true)}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.dashboard?.logSale || 'Log New Sale'}</span>
          </button>

          <button
            onClick={() => setExpenseModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-orange-500" />
            <span>{t.dashboard?.logExpense || 'Log Expense'}</span>
          </button>

          <Link
            to="/calculator"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4 text-orange-500" />
            <span>{t.dashboard?.checkPrice || 'Calculate Price'}</span>
          </Link>

          <Link
            to="/marketing"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Megaphone className="w-4 h-4 text-orange-500" />
            <span>Create Ad</span>
          </Link>

          <Link
            to="/assistant"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.dashboard?.askAssistant || 'Ask AI Assistant'}</span>
          </Link>
        </div>
      </div>

      {/* AI Insight & Daily Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insight */}
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50/50 rounded-3xl p-6 border border-orange-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>{t.dashboard?.aiInsight || 'AI Business Insight'}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Updated 2h ago</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {aiInsight?.insightTitle || 'Weekly Business Intelligence'}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed">
              {aiInsight?.insightText || 'Your Mango Pickle maintains a healthy 33.3% net margin. Focus on locking bulk pre-orders for upcoming festivals.'}
            </p>
          </div>

          <div className="pt-4 border-t border-orange-100 mt-4 flex items-center justify-between">
            <Link
              to="/assistant"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>Discuss details with AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Today's Action Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {t.dashboard?.todayAction || "Today's Action Plan"}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {actions.filter(a => a.done).length}/{actions.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {actions.map((act) => (
                <div
                  key={act.id}
                  onClick={() => toggleAction(act.id)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    act.done
                      ? 'bg-slate-50/70 border-slate-200/60 opacity-60'
                      : 'bg-white border-slate-200 hover:border-orange-300'
                  }`}
                >
                  {act.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${act.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {act.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 text-[11px] text-slate-400 text-right">
            Click to mark tasks as completed
          </div>
        </div>
      </div>

      {/* Visual Charts: Sales vs Expenses Trend & Category Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend (2 Cols) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.dashboard?.salesTrend || 'Monthly Sales & Profit Trend'}
              </h3>
              <p className="text-xs text-slate-400">6-Month financial progression (INR)</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="sales" name="Sales" fill="#ea580c" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.dashboard?.expenseBreakdown || 'Expense Breakdown'}
            </h3>
            <p className="text-xs text-slate-400">Where capital is being deployed</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEMO_EXPENSE_PIE}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {DEMO_EXPENSE_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5">
            {DEMO_EXPENSE_PIE.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Sale Log Modal */}
      <Modal
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        title="Log New Sale Record"
      >
        <form onSubmit={handleSaleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product</label>
            <select
              value={saleForm.productName}
              onChange={(e) => setSaleForm({ ...saleForm, productName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
            >
              <option value="Avakaya (Mango) Pickle - 1kg">Avakaya (Mango) Pickle - 1kg</option>
              <option value="Gongura Pickle - 500g">Gongura Pickle - 500g</option>
              <option value="Kandi Podi - 250g">Kandi Podi - 250g</option>
              <option value="Tomato Pickle - 500g">Tomato Pickle - 500g</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={saleForm.quantity}
                onChange={(e) => {
                  const qty = Number(e.target.value);
                  setSaleForm({ ...saleForm, quantity: qty, amount: qty * 180 });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                value={saleForm.amount}
                onChange={(e) => setSaleForm({ ...saleForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Customer / Store Name</span>
              <VoiceInputButton
                onTranscript={(text) => setSaleForm({ ...saleForm, customer: text })}
                className="p-1"
              />
            </label>
            <input
              type="text"
              value={saleForm.customer}
              onChange={(e) => setSaleForm({ ...saleForm, customer: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              placeholder="e.g. Sri Venkateswara Kirana"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            Save Sale Record
          </button>
        </form>
      </Modal>

      {/* Quick Expense Log Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Log Business Expense"
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
            >
              <option value="Raw Materials">Raw Materials</option>
              <option value="Packaging">Packaging & Jars</option>
              <option value="Labour">Labour / Helping Hands</option>
              <option value="Transportation">Transportation & Auto</option>
              <option value="Electricity & Gas">Electricity & Gas</option>
              <option value="Marketing">Marketing / Labels</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              required
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Description</span>
              <VoiceInputButton
                onTranscript={(text) => setExpenseForm({ ...expenseForm, description: text })}
                className="p-1"
              />
            </label>
            <input
              type="text"
              required
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              placeholder="e.g. Sesame oil 15L tin"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            Save Expense Record
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
