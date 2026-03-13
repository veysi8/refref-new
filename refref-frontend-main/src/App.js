import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import HomePage from '@/pages/HomePage';
import PropertiesPage from '@/pages/PropertiesPage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import ContactPage from '@/pages/ContactPage';
import FavoritesPage from '@/pages/FavoritesPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;