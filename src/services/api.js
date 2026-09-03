import axios from 'axios';
import {
  DEMO_USER,
  DEMO_BUSINESS,
  DEMO_PRODUCTS,
  DEMO_SALES,
  DEMO_EXPENSES,
  SAMPLE_RECOMMENDATION
} from '../data/mockData.js';
import { GOVERNMENT_SCHEMES } from '../data/schemesData.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for JWT
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// Local persistence helpers for robust standalone demo
const initLocalStorage = () => {
  if (!localStorage.getItem('vm_business')) {
    localStorage.setItem('vm_business', JSON.stringify(DEMO_BUSINESS));
  }
  if (!localStorage.getItem('vm_products')) {
    localStorage.setItem('vm_products', JSON.stringify(DEMO_PRODUCTS));
  }
  if (!localStorage.getItem('vm_sales')) {
    localStorage.setItem('vm_sales', JSON.stringify(DEMO_SALES));
  }
  if (!localStorage.getItem('vm_expenses')) {
    localStorage.setItem('vm_expenses', JSON.stringify(DEMO_EXPENSES));
  }
  if (!localStorage.getItem('vm_user')) {
    localStorage.setItem('vm_user', JSON.stringify(DEMO_USER));
  }
};

initLocalStorage();

const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const authService = {
  login: async (credentials) => {
    try {
      const res = await API.post('/auth/login', credentials);
      if (res && res.data) {
        localStorage.setItem('vm_token', res.data.token || 'demo-jwt-token');
        return res;
      }
    } catch (e) {
      console.info('Backend unreachable, using local auth mock');
    }
    const user = getStored('vm_user', DEMO_USER);
    localStorage.setItem('vm_token', 'demo-jwt-token');
    return {
      success: true,
      message: 'Login successful (Demo Mode)',
      data: { user, token: 'demo-jwt-token' }
    };
  },

  register: async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res && res.data) {
        localStorage.setItem('vm_token', res.data.token || 'demo-jwt-token');
        return res;
      }
    } catch (e) {
      console.info('Backend unreachable, using local registration mock');
    }
    const newUser = { ...DEMO_USER, ...userData, _id: 'user-' + Date.now() };
    setStored('vm_user', newUser);
    localStorage.setItem('vm_token', 'demo-jwt-token');
    return {
      success: true,
      message: 'Registration successful',
      data: { user: newUser, token: 'demo-jwt-token' }
    };
  },

  getCurrentUser: async () => {
    try {
      return await API.get('/auth/me');
    } catch (e) {
      return {
        success: true,
        data: getStored('vm_user', DEMO_USER),
        message: 'Current user profile'
      };
    }
  }
};

export const businessService = {
  getBusiness: async () => {
    try {
      return await API.get('/business');
    } catch (e) {
      return {
        success: true,
        data: getStored('vm_business', DEMO_BUSINESS),
        message: 'Business fetched'
      };
    }
  },

  createBusiness: async (bizData) => {
    try {
      return await API.post('/business', bizData);
    } catch (e) {
      const newBiz = { ...DEMO_BUSINESS, ...bizData, _id: 'biz-' + Date.now() };
      setStored('vm_business', newBiz);
      return {
        success: true,
        data: newBiz,
        message: 'Business created successfully'
      };
    }
  },

  updateBusiness: async (id, bizData) => {
    try {
      return await API.put(`/business/${id}`, bizData);
    } catch (e) {
      const current = getStored('vm_business', DEMO_BUSINESS);
      const updated = { ...current, ...bizData };
      setStored('vm_business', updated);
      return {
        success: true,
        data: updated,
        message: 'Business updated successfully'
      };
    }
  }
};

export const productService = {
  getProducts: async () => {
    try {
      return await API.get('/products');
    } catch (e) {
      return {
        success: true,
        data: getStored('vm_products', DEMO_PRODUCTS),
        message: 'Products loaded'
      };
    }
  },

  addProduct: async (productData) => {
    try {
      return await API.post('/products', productData);
    } catch (e) {
      const products = getStored('vm_products', DEMO_PRODUCTS);
      const newProduct = {
        ...productData,
        _id: 'prod-' + Date.now(),
        businessId: 'biz-lakshmi-01'
      };
      products.unshift(newProduct);
      setStored('vm_products', products);
      return {
        success: true,
        data: newProduct,
        message: 'Product added successfully'
      };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      return await API.put(`/products/${id}`, productData);
    } catch (e) {
      const products = getStored('vm_products', DEMO_PRODUCTS);
      const index = products.findIndex(product => product._id === id);
      if (index === -1) {
        return {
          success: false,
          message: 'Product not found'
        };
      }

      const updatedProduct = { ...products[index], ...productData, _id: id };
      products[index] = updatedProduct;
      setStored('vm_products', products);
      return {
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      };
    }
  },

  deleteProduct: async (id) => {
    try {
      return await API.delete(`/products/${id}`);
    } catch (e) {
      let products = getStored('vm_products', DEMO_PRODUCTS);
      products = products.filter(p => p._id !== id);
      setStored('vm_products', products);
      return {
        success: true,
        message: 'Product deleted successfully',
        data: { _id: id }
      };
    }
  }
};

export const salesService = {
  getSales: async () => {
    try {
      return await API.get('/sales');
    } catch (e) {
      return {
        success: true,
        data: getStored('vm_sales', DEMO_SALES),
        message: 'Sales loaded'
      };
    }
  },

  addSale: async (saleData) => {
    try {
      return await API.post('/sales', saleData);
    } catch (e) {
      const sales = getStored('vm_sales', DEMO_SALES);
      const newSale = {
        ...saleData,
        _id: 'sale-' + Date.now(),
        businessId: 'biz-lakshmi-01',
        date: saleData.date || new Date().toISOString().split('T')[0]
      };
      sales.unshift(newSale);
      setStored('vm_sales', sales);

      const biz = getStored('vm_business', DEMO_BUSINESS);
      biz.monthlySales = (biz.monthlySales || 0) + Number(newSale.amount || 0);
      biz.monthlyProfit = biz.monthlySales - (biz.monthlyExpenses || 0);
      setStored('vm_business', biz);

      return {
        success: true,
        data: newSale,
        message: 'Sale recorded successfully'
      };
    }
  }
};

export const expenseService = {
  getExpenses: async () => {
    try {
      return await API.get('/expenses');
    } catch (e) {
      return {
        success: true,
        data: getStored('vm_expenses', DEMO_EXPENSES),
        message: 'Expenses loaded'
      };
    }
  },

  addExpense: async (expenseData) => {
    try {
      return await API.post('/expenses', expenseData);
    } catch (e) {
      const expenses = getStored('vm_expenses', DEMO_EXPENSES);
      const newExpense = {
        ...expenseData,
        _id: 'exp-' + Date.now(),
        businessId: 'biz-lakshmi-01',
        date: expenseData.date || new Date().toISOString().split('T')[0]
      };
      expenses.unshift(newExpense);
      setStored('vm_expenses', expenses);

      const biz = getStored('vm_business', DEMO_BUSINESS);
      biz.monthlyExpenses = (biz.monthlyExpenses || 0) + Number(newExpense.amount || 0);
      biz.monthlyProfit = (biz.monthlySales || 0) - biz.monthlyExpenses;
      setStored('vm_business', biz);

      return {
        success: true,
        data: newExpense,
        message: 'Expense recorded successfully'
      };
    }
  }
};

export const calculatorService = {
  calculate: async (calcData) => {
    const materialCost = Number(calcData.materialCost || 0);
    const labourCost = Number(calcData.labourCost || 0);
    const packagingCost = Number(calcData.packagingCost || 0);
    const transportCost = Number(calcData.transportCost || 0);
    const otherCost = Number(calcData.otherCost || 0);
    const sellingPrice = Number(calcData.sellingPrice || 0);

    const totalCost = materialCost + labourCost + packagingCost + transportCost + otherCost;
    const profit = sellingPrice - totalCost;
    const profitMargin = sellingPrice > 0 ? Number(((profit / sellingPrice) * 100).toFixed(1)) : 0;
    const markup = totalCost > 0 ? Number(((profit / totalCost) * 100).toFixed(1)) : 0;
    const breakEvenUnits = profit > 0 ? Math.ceil(5000 / profit) : 0;

    const result = {
      productName: calcData.productName || 'Custom Product',
      materialCost,
      labourCost,
      packagingCost,
      transportCost,
      otherCost,
      totalCost,
      sellingPrice,
      profit,
      profitMargin,
      markup,
      breakEvenUnits,
      isHealthy: profitMargin >= 20
    };

    try {
      const serverRes = await API.post('/calculator', calcData);
      if (serverRes && serverRes.data) return serverRes;
    } catch (e) {
      // Backend offline
    }

    return {
      success: true,
      data: result,
      message: 'Calculation performed accurately'
    };
  }
};

export const schemeService = {
  getSchemes: async (params = {}) => {
    try {
      return await API.get('/schemes', { params });
    } catch (e) {
      let list = GOVERNMENT_SCHEMES;
      if (params.category && params.category !== 'All') {
        list = list.filter(s => s.category.toLowerCase().includes(params.category.toLowerCase()));
      }
      return {
        success: true,
        data: list,
        message: 'Government schemes loaded'
      };
    }
  },

  getSchemeById: async (id) => {
    try {
      return await API.get(`/schemes/${id}`);
    } catch (e) {
      const found = GOVERNMENT_SCHEMES.find(s => s._id === id) || GOVERNMENT_SCHEMES[0];
      return {
        success: true,
        data: found,
        message: 'Scheme details'
      };
    }
  },

  recommendSchemes: async (businessData) => {
    try {
      return await API.post('/schemes/recommend', businessData);
    } catch (e) {
      return {
        success: true,
        data: GOVERNMENT_SCHEMES.slice(0, 4),
        message: 'Recommended government schemes'
      };
    }
  }
};

export const aiService = {
  getBusinessRecommendation: async (discoveryInputs) => {
    try {
      return await API.post('/ai/business-recommendation', discoveryInputs);
    } catch (e) {
      const budget = Number(discoveryInputs.budget || 40000);
      const customized = JSON.parse(JSON.stringify(SAMPLE_RECOMMENDATION));
      customized.recommendedBusiness.estimatedBudget = budget;
      customized.recommendedBusiness.operatingMetrics.estimatedStartupBudget = budget;
      if (discoveryInputs.location) {
        customized.recommendedBusiness.locationReasoning = `${discoveryInputs.location} (${discoveryInputs.state || 'Andhra Pradesh'}) has growing consumer demand for fresh, preservative-free regional foods and direct access to weekly markets and transport corridors.`;
      }
      return {
        success: true,
        data: customized,
        message: 'AI recommendations generated'
      };
    }
  },

  chat: async (chatPayload) => {
    try {
      return await API.post('/ai/chat', chatPayload);
    } catch (e) {
      const msg = (chatPayload.message || '').toLowerCase();
      const lang = chatPayload.language || 'en';
      let reply = '';

      if (msg.includes('sales') || msg.includes('అమ్మకాలు') || msg.includes('बिक्री')) {
        reply = lang === 'te'
          ? "మీ వ్యాపార అమ్మకాలను పెంచడానికి 3 ఆచరణాత్మక మార్గాలు:\n1. స్థానిక వాట్సాప్ గ్రూపులలో ప్రతి ఉదయం తాజా ఆఫర్ మెసేజ్ పంపండి.\n2. 5 కిరాణా షాపులకు శాంపిల్ సీసాలు ఉచితంగా ఇచ్చి 20% డీలర్ మార్జిన్ అందించండి.\n3. పండుగల సమయాల్లో 2kg కొనుగోలుపై ₹30 రాయితీ కాంబో ఆఫర్ ప్రవేశపెట్టండి."
          : "3 practical ways to increase your sales:\n1. Share a WhatsApp catalogue with attractive photos in local community groups.\n2. Partner with 5 local Kirana stores offering them a healthy 20% margin.\n3. Run a festive combo offer (e.g. Save ₹30 when buying 2kg Mango Pickle).";
      } else if (msg.includes('price') || msg.includes('ధర') || msg.includes('कीमत')) {
        reply = lang === 'te'
          ? "మీ మామిడికాయ పచ్చడి ఉత్పత్తి ఖర్చు ₹120 ఉన్నప్పుడు, ₹180 అమ్మకం ధర (33.3% లాభం) చాలా ఆరోగ్యకరమైనది! గ్రామీణ మార్కెట్లలో 25%-35% లాభ మార్జిన్ ఉత్తమమైనది. ధర పెంచడం కంటే ప్యాకేజింగ్ మరియు లేబులింగ్ ద్వారా నాణ్యతను చూపించడం మేలు."
          : "At ₹120 cost price and ₹180 selling price, your 33.3% net profit margin is very healthy! For rural food retail, 25-35% is ideal. Rather than changing price, focus on attractive tamper-proof jar seals to justify the premium quality.";
      } else if (msg.includes('scheme') || msg.includes('పథకాలు') || msg.includes('योजना')) {
        reply = lang === 'te'
          ? "మీ ఫుడ్ ప్రాసెసింగ్ వ్యాపారం కోసం 2 ప్రధాన పథకాలు చాలా అనుకూలం:\n1. **పీఎం ముద్రా లోన్ (శిశు)**: ₹50,000 వరకు ఎలాంటి తనఖా లేకుండా తక్కువ వడ్డీతో రుణం.\n2. **పీఎంఈజీపీ (PMEGP)**: గ్రామీణ మహిళా పారిశ్రామికవేత్తలకు 35% వరకు సబ్సిడీ లభిస్తుంది."
          : "For your food processing enterprise, two major schemes fit best:\n1. **PMMY MUDRA (Shishu)**: Collateral-free loan up to ₹50,000 for working capital and packaging tools.\n2. **PMEGP**: Up to 35% margin money capital subsidy for rural women setting up micro manufacturing units.";
      } else {
        reply = lang === 'te'
          ? 'నమస్కారం! లక్ష్మి హోమ్‌మేడ్ ఫుడ్స్ వ్యాపారానికి సంబంధించి మీ ప్రశ్నను పరిశీలించాను. మీ ప్రస్తుత నెలవారీ లాభం ₹13,900 ను క్రమంగా పెంచడానికి ఖర్చులను నియంత్రించడం మరియు ఎక్కువ మంది స్థానిక కస్టమర్లను చేరడం ముఖ్యం.'
          : 'Hello! I analyzed your business context for Lakshmi Homemade Foods. With your current ₹13,900 monthly profit, the best growth levers are expanding local retail partners and streamlining bulk ingredient purchases.';
      }

      return {
        success: true,
        data: {
          reply,
          suggestedActions: [
            "Check MUDRA Loan eligibility",
            "Generate festival WhatsApp ad",
            "Calculate bulk batch costs"
          ]
        },
        message: 'AI response generated'
      };
    }
  },

  generateMarketingContent: async (marketingInputs) => {
    try {
      return await API.post('/ai/marketing', marketingInputs);
    } catch (e) {
      const { product, discount, language } = marketingInputs;
      const lang = language || 'en';

      let whatsappMessage = '';
      let socialPost = '';
      let posterText = '';

      if (lang === 'te') {
        whatsappMessage = `రుచికరమైన సాంప్రదాయ ${product || 'ఆంధ్ర పచ్చడి'} ఇప్పుడు మీ ముంగిట! 🌶️🥭\n\nమా స్వచ్ఛమైన నువ్వుల నూనె, గుంటూరు కారంతో ఇంట్లో తయారు చేసిన అసలైన ఆంధ్ర పచ్చడి.\n\n✨ ప్రత్యేక ఆఫర్: ${discount || 'ఈరోజే ఆర్డర్ చేయండి'}\n📍 డెలివరీ: ఇంటి వద్దకే డెలివరీ అందుబాటులో ఉంది.\n📞 ఆర్డర్ల కోసం ఇప్పుడే సంప్రదించండి: 9876543210\nలక్ష్మి హోమ్‌మేడ్ ఫుడ్స్`;
        socialPost = `అమ్మ చేతి పచ్చడి రుచిని గుర్తుచేసే అసలైన ఆంధ్ర ${product || 'పచ్చడి'}! శుభ్రంగా, సాంప్రదాయ పద్ధతిలో తయారుచేసినది.\n\n👉 ఈరోజే ఆర్డర్ చేయండి: ${discount || ''}\n#AndhraPickles #HomemadeFood #VocalForLocal #VyaparMitra`;
        posterText = `🎉 ప్రత్యేక పండుగ ఆఫర్! 🎉\n\nతాజా ${product || 'ఆంధ్ర పచ్చడి'}\nనాణ్యత గల పదార్ధాలతో శుభ్రమైన తయారీ\n\nరాయితీ: ${discount || 'ప్రత్యేక ధర'}\nసంప్రదించండి: లక్ష్మి హోమ్‌మేడ్ ఫుడ్స్ - 9876543210`;
      } else {
        whatsappMessage = `Crispy & Authentic Homemade ${product || 'Pickles'} at your doorstep! 🌶️🥭\n\nPrepared using traditional recipes, cold-pressed sesame oil, and authentic Guntur chillies.\n\n✨ Special Offer: ${discount || 'Order today'}\n📍 Free local doorstep delivery in town.\n📞 WhatsApp / Call to order: 9876543210\nLakshmi Homemade Foods`;
        socialPost = `Taste the authentic tradition of homemade ${product || 'pickles'}! Made with love, zero preservatives, and pure ingredients. ❤️\n\nOrder today: ${discount || ''}\n#HomemadePickles #VocalForLocal #VyaparMitra`;
        posterText = `🎉 SPECIAL FESTIVAL OFFER! 🎉\n\nFresh Batch of Traditional ${product || 'Pickles'}\n100% Hygienic • Cold Pressed Oil • Farm Fresh\n\nSpecial Price: ${discount || 'Ask us today'}\nContact: Lakshmi Homemade Foods - 9876543210`;
      }

      return {
        success: true,
        data: {
          whatsappMessage,
          socialPost,
          posterText
        },
        message: 'Marketing copy generated successfully'
      };
    }
  }
};

export const dashboardService = {
  getDashboardData: async () => {
    try {
      return await API.get('/dashboard');
    } catch (e) {
      const biz = getStored('vm_business', DEMO_BUSINESS);
      const sales = getStored('vm_sales', DEMO_SALES);
      const expenses = getStored('vm_expenses', DEMO_EXPENSES);
      return {
        success: true,
        data: {
          business: biz,
          salesSummary: {
            monthlySales: biz.monthlySales || 35200,
            growth: "+14.2% from last month"
          },
          expenseSummary: {
            monthlyExpenses: biz.monthlyExpenses || 21300,
            growth: "+3.8% from last month"
          },
          profitSummary: {
            monthlyProfit: (biz.monthlySales || 35200) - (biz.monthlyExpenses || 21300),
            profitMargin: "39.5%"
          },
          healthScore: biz.healthScore || 84,
          recentSales: sales.slice(0, 5),
          recentExpenses: expenses.slice(0, 5)
        },
        message: 'Dashboard data loaded'
      };
    }
  }
};
