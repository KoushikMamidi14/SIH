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
  const { business, sales, expenses, products, addSale, addExpense } = useBusiness();

  const [dashboardData, setDashboardData] = useState(null);
  const [actions, setActions] = useState([]);
  const [aiInsight, setAiInsight] = useState(null);

  // Quick action modals
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Form states for quick modals
  const [saleForm, setSaleForm] = useState({
    productName: '',
    quantity: '',
    amount: '',
    customer: '',
    paymentMethod: ''
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
      productName: '',
      quantity: '',
      amount: '',
      customer: '',
      paymentMethod: ''
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
  const expenseCategoryKeys = {
    'Raw Materials': 'rawMaterials',
    Labour: 'labour',
    Packaging: 'packaging',
    'Utilities / Gas': 'electricity',
    Transport: 'transportation',
    Marketing: 'marketing'
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Business Info + Health Score */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
              {business?.category || t.dashboard?.category || 'Food Products'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {business?.location || t.dashboard?.location || 'Tenali, Andhra Pradesh'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {business?.name || 'Lakshmi Homemade Foods'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.dashboard?.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <HealthScoreBadge score={healthScore} />
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t.dashboard?.totalSales}
          value={formatCurrency(totalSales)}
          subtitle={t.dashboard?.salesGrowth}
          icon={TrendingUp}
          trend={14.2}
          color="green"
        />

        <MetricCard
          title={t.dashboard?.totalExpenses}
          value={formatCurrency(totalExpenses)}
          subtitle={t.dashboard?.expensesGrowth}
          icon={Receipt}
          trend={-3.8}
          color="orange"
        />

        <MetricCard
          title={t.dashboard?.netProfit}
          value={formatCurrency(netProfit)}
          subtitle={t.dashboard?.netMargin}
          icon={DollarSign}
          trend={22.4}
          color="green"
        />

        <MetricCard
          title={t.dashboard?.healthScore}
          value={`${healthScore}/100`}
          subtitle={t.dashboard?.healthGood || 'Healthy & Growing'}
          icon={Sparkles}
          color="blue"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
          {t.dashboard?.quickActions}:
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
            <span>{t.dashboard?.createAd}</span>
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
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-900 bg-orange-100 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>{t.dashboard?.aiInsight || 'AI Business Insight'}</span>
              </div>
              <span className="text-[11px] text-slate-700 font-medium">{t.dashboard?.updated}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {aiInsight?.insightTitle || t.dashboard?.aiInsight}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed">
              {aiInsight?.insightText || t.dashboard?.aiInsight}
            </p>
          </div>

          <div className="pt-4 border-t border-orange-100 mt-4 flex items-center justify-between">
            <Link
              to="/assistant"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>{t.dashboard?.discussAi}</span>
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
                  {t.dashboard?.todayAction}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {actions.filter(a => a.done).length}/{actions.length} {t.dashboard?.completed}
              </span>
            </div>

            <div className="space-y-3">
              {actions.map((act) => (
                <button
                  key={act.id}
                  onClick={() => toggleAction(act.id)}
                  type="button"
                  aria-pressed={act.done}
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
                  <span className={`text-left text-xs sm:text-sm font-medium ${act.done ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                    {act.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 text-[11px] text-slate-700 text-right">
            {t.dashboard?.markCompleted}
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
                <p className="text-xs text-slate-700">{t.dashboard?.chartSubtitle}</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, color: '#334155' }} />
                <Bar dataKey="sales" name={t.dashboard?.sales} fill="#ea580c" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name={t.dashboard?.expenses} fill="#64748b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name={t.dashboard?.profit} fill="#059669" radius={[6, 6, 0, 0]} />
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
            <p className="text-xs text-slate-700">{t.dashboard?.deployedCapital}</p>
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
                  <span className="font-medium text-slate-800">{t.dashboard?.[expenseCategoryKeys[item.name]] || item.name}</span>
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
        title={t.dashboard?.logSaleRecord}
      >
        <form onSubmit={handleSaleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">{t.dashboard?.product}</label>
            <select
              value={saleForm.productName}
              onChange={(e) => {
                const selectedProduct = products.find((product) => product.name === e.target.value);
                setSaleForm({ ...saleForm, productName: e.target.value, amount: Number(saleForm.quantity || 0) * Number(selectedProduct?.sellingPrice || 0) });
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
            >
              <option value="" disabled>{t.dashboard?.selectProduct}</option>
              {products.map((product) => <option key={product._id} value={product.name}>{product.name} ({formatCurrency(product.sellingPrice)})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">{t.dashboard?.quantity}</label>
              <input
                type="number"
                min="1"
                required
                value={saleForm.quantity}
                onChange={(e) => {
                  const qty = Number(e.target.value);
                  const selectedProduct = products.find((product) => product.name === saleForm.productName);
                  setSaleForm({ ...saleForm, quantity: qty, amount: qty * Number(selectedProduct?.sellingPrice || 0) });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">{t.dashboard?.amount}</label>
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
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>{t.dashboard?.customerStore}</span>
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
              placeholder={t.dashboard?.customerPlaceholder}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            {t.dashboard?.saveSale}
          </button>
        </form>
      </Modal>

      {/* Quick Expense Log Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title={t.dashboard?.logExpenseRecord}
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">{t.dashboard?.categoryLabel}</label>
            <select
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
            >
              <option value="" disabled>{t.dashboard?.selectCategory}</option>
              <option value="Raw Materials">{t.dashboard?.rawMaterials}</option>
              <option value="Packaging">{t.dashboard?.packaging}</option>
              <option value="Labour">{t.dashboard?.labour}</option>
              <option value="Transportation">{t.dashboard?.transportation}</option>
              <option value="Electricity & Gas">{t.dashboard?.electricity}</option>
              <option value="Marketing">{t.dashboard?.marketing}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">{t.dashboard?.amount}</label>
            <input
              type="number"
              required
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>{t.dashboard?.description}</span>
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
              placeholder={t.dashboard?.descriptionPlaceholder}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            {t.dashboard?.saveExpense}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
