import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, LogIn, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1e3a5f] shadow-lg' : 'bg-[#1e3a5f]'
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3" data-testid="logo-link">
            <img
              src="https://customer-assets.emergentagent.com/job_home-finder-173/artifacts/at5msrjd_image.jpg"
              alt="RefRef Emlak Logo"
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-[#60a5fa] transition-colors font-medium text-sm"
              data-testid="nav-home"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/properties?type=sale"
              className="text-white hover:text-[#60a5fa] transition-colors font-medium text-sm"
              data-testid="nav-sale"
            >
              Satılık
            </Link>
            <Link
              to="/properties?type=rent"
              className="text-white hover:text-[#60a5fa] transition-colors font-medium text-sm"
              data-testid="nav-rent"
            >
              Kiralık
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-[#60a5fa] transition-colors font-medium text-sm"
              data-testid="nav-contact"
            >
              İletişim
            </Link>

            <Link
              to="/favorites"
              className="text-white hover:text-[#60a5fa] transition-colors"
              data-testid="nav-favorites"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin/dashboard"
                  className="text-white hover:text-[#60a5fa] transition-colors font-medium text-sm"
                  data-testid="nav-dashboard"
                >
                  Dashboard
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-[#60a5fa] hover:bg-white/10"
                  data-testid="logout-btn"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış
                </Button>
              </div>
            ) : (
              <Link to="/admin/login" data-testid="nav-login">
                <Button
                  size="sm"
                  className="bg-[#3498DB] text-white hover:bg-[#2980B9] border-0"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white hover:text-[#60a5fa] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-btn"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4 bg-[#1e3a5f]" data-testid="mobile-menu">
            <Link
              to="/"
              className="block text-white hover:text-[#60a5fa] transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/properties?type=sale"
              className="block text-white hover:text-[#60a5fa] transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Satılık
            </Link>
            <Link
              to="/properties?type=rent"
              className="block text-white hover:text-[#60a5fa] transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Kiralık
            </Link>
            <Link
              to="/contact"
              className="block text-white hover:text-[#60a5fa] transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              İletişim
            </Link>
            <Link
              to="/favorites"
              className="block text-white hover:text-[#60a5fa] transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Favorilerim
            </Link>
            {user ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block text-white hover:text-[#60a5fa] transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-white hover:text-[#60a5fa] transition-colors font-medium"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="block text-white hover:text-[#60a5fa] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Giriş Yap
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;