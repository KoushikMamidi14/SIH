import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const BrandLogo = ({ compact = false, className = '' }) => {
  const { t } = useLanguage();

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="VyaparMitra home">
      <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20" aria-hidden="true">
        <Store className="w-5 h-5" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="flex flex-col">
          <span className="font-extrabold text-xl leading-none text-slate-900 tracking-tight">
            Vyapar<span className="text-orange-600">Mitra</span>
          </span>
          <span className="text-[10px] font-medium text-slate-500 mt-1">{t.tagline || 'Your Business Partner in Your Language'}</span>
        </span>
      )}
    </Link>
  );
};

export default BrandLogo;
  

