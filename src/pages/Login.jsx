import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Store, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phoneOrEmail, setPhoneOrEmail] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ phoneOrEmail, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    try {
      await login({ phoneOrEmail: '9876543210', password: 'demo' });
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">{t.nav?.login || 'Login'}</h2>
        <p className="text-xs text-slate-500 mt-1">Enter your phone number or email to access your business account</p>
      </div>

      {error && (
        <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Quick Demo Fill Button */}
      <button
        type="button"
        onClick={handleQuickDemo}
        className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 flex items-center justify-center gap-2 transition-colors shadow-xs"
      >
        <Sparkles className="w-4 h-4 text-orange-500" />
        <span>Instant Login as Lakshmi Homemade Foods (Demo)</span>
      </button>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase">Or Login with Phone</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mobile Number / Email
          </label>
          <input
            type="text"
            required
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            placeholder="e.g. 9876543210"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Password / PIN
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Signing in...' : 'Sign In to Business'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-500">
        New entrepreneur?{' '}
        <Link to="/register" className="font-bold text-orange-600 hover:underline">
          Create account
        </Link>{' '}
        or{' '}
        <Link to="/business-discovery" className="font-bold text-orange-600 hover:underline">
          Discover a business first
        </Link>
      </div>
    </div>
  );
};

export default Login;
