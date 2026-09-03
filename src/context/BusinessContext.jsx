import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { businessService, productService, salesService, expenseService } from '../services/api.js';

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bizRes, prodRes, salesRes, expRes] = await Promise.all([
        businessService.getBusiness(),
        productService.getProducts(),
        salesService.getSales(),
        expenseService.getExpenses()
      ]);

      if (bizRes && bizRes.data) setBusiness(bizRes.data);
      if (prodRes && prodRes.data) setProducts(prodRes.data);
      if (salesRes && salesRes.data) setSales(salesRes.data);
      if (expRes && expRes.data) setExpenses(expRes.data);
    } catch (err) {
      console.error('Error refreshing business context:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const updateBusiness = async (data) => {
    if (!business) return;
    const res = await businessService.updateBusiness(business._id, data);
    if (res && res.data) {
      setBusiness(res.data);
    }
    return res;
  };

  const addProduct = async (productData) => {
    const res = await productService.addProduct(productData);
    if (res && res.data) {
      setProducts(prev => [res.data, ...prev]);
    }
    return res;
  };

  const updateProduct = async (id, productData) => {
    const res = await productService.updateProduct(id, productData);
    if (res && res.data) {
      setProducts(prev => prev.map(product => (
        product._id === id ? res.data : product
      )));
    }
    return res;
  };

  const deleteProduct = async (id) => {
    const res = await productService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p._id !== id));
    return res;
  };

  const addSale = async (saleData) => {
    const res = await salesService.addSale(saleData);
    if (res && res.data) {
      setSales(prev => [res.data, ...prev]);
      await refreshAll();
    }
    return res;
  };

  const addExpense = async (expData) => {
    const res = await expenseService.addExpense(expData);
    if (res && res.data) {
      setExpenses(prev => [res.data, ...prev]);
      await refreshAll();
    }
    return res;
  };

  return (
    <BusinessContext.Provider value={{
      business,
      products,
      sales,
      expenses,
      loading,
      refreshAll,
      updateBusiness,
      addProduct,
      updateProduct,
      deleteProduct,
      addSale,
      addExpense
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);
