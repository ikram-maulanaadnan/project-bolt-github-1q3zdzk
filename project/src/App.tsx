// File: src/App.tsx
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import AdminApp from './components/admin/AdminApp';
import LandingPage from './components/LandingPage';
import PaymentStatus from './components/PaymentStatus'; // <-- Komponen diimpor di sini
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminApp />} />
            
            {/* Rute untuk Halaman Status Pembayaran sudah terdaftar di sini */}
            <Route path="/payment-status" element={<PaymentStatus />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;