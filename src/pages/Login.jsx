import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phoneOrEmail, setPhoneOrEmail] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState('');

  const isValidPhoneOrEmail = (value) => {
    const trimmedValue = value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9]{10,15}$/;
    return emailPattern.test(trimmedValue) || phonePattern.test(trimmedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPhoneOrEmail(phoneOrEmail)) {
      setInputError(t.login.invalidInput);
      return;
    }

    setLoading(true);
    setError('');
    setInputError('');
    try {
      await login({ phoneOrEmail, password });
      navigate('/dashboard');
    } catch (err) {
      setError(t.login.loginError);
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
      setError(t.login.demoLoginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">{t.login.title}</h2>
        <p className="text-xs text-slate-500 mt-1">{t.login.subtitle}</p>
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
        <span>{t.login.demoButton}</span>
      </button>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase">{t.login.phoneDivider}</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone-or-email" className="block text-xs font-bold text-slate-700 mb-1">{t.login.phoneOrEmailLabel}</label>
          <input
            id="phone-or-email"
            type="text"
            required
            value={phoneOrEmail}
            onChange={(e) => {
              setPhoneOrEmail(e.target.value);
              if (inputError) setInputError('');
            }}
            aria-invalid={Boolean(inputError)}
            aria-describedby={inputError ? 'phone-or-email-error' : undefined}
            className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            placeholder={t.login.phoneOrEmailPlaceholder}
          />
          {inputError && <p id="phone-or-email-error" className="mt-1.5 text-xs font-semibold text-rose-700">{inputError}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1">{t.login.passwordLabel}</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 pr-11 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
              placeholder={t.login.passwordPlaceholder}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
              title={showPassword ? t.login.hidePassword : t.login.showPassword}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-800"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <span>{loading ? t.login.signingIn : t.login.signInButton}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-500">
        {t.login.newEntrepreneur}{' '}
        <Link to="/register" className="font-bold text-orange-600 hover:underline">
          {t.login.createAccount}
        </Link>{' '}
        {t.login.or}{' '}
        <Link to="/business-discovery" className="font-bold text-orange-600 hover:underline">
          {t.login.discoverBusiness}
        </Link>
      </div>
    </div>
  );
};

export default Login;
