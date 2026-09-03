import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import LanguageSelector from '../common/LanguageSelector.jsx';
import { Store } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const AuthLayout = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Store className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
            Vyapar<span className="text-orange-600">Mitra</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-medium">
          {t.tagline || 'Your Business Partner in Your Language'}
        </p>

        <div className="mt-3 flex justify-center">
          <LanguageSelector />
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
