import React from 'react';
import { useAppContext } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import ClientLayout from './components/layout/ClientLayout';
import AdminLayout from './components/layout/AdminLayout';
import RoleSwitcher from './components/RoleSwitcher';
import './styles/global.scss';

// app decides only about layout selection
// routing is handled inside layouts
function App() {
  const { isAdmin } = useAppContext();

  return (
    <div className="app-container">
      <Toaster position="top-center" />
      <RoleSwitcher />

      {isAdmin ? <AdminLayout /> : <ClientLayout />}
    </div>
  );
}

export default App;
