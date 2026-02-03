import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import initialProducts from '../data/products.json'; 

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


  const contextValue = {
    products, setProducts,
    cart, setCart,
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