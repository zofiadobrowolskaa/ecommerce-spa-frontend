import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import initialProducts from '../data/products.json';
import { authService } from '../auth/authService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [products, setProducts] = useLocalStorage('products', initialProducts);
  const [cart, setCart] = useLocalStorage('cart', []);
  const [userRole, setUserRole] = useLocalStorage('userRole', 'client'); 

  const isAdmin = userRole === 'admin';
  const loginAs = (role) => {
    if (role === 'admin' || role === 'client') {
        setUserRole(role);
    }
  };

  const addToCart = useCallback((productId, variantId, quantity = 1, size = null) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.productId === productId && item.variantId === variantId && item.size === size);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { productId, variantId, quantity, size }];
    });
  }, [setCart]);


  const contextValue = {
    products, setProducts,
    cart, setCart, addToCart,
    userRole, setUserRole, loginAs, isAdmin
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}