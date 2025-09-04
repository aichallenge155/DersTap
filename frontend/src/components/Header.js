import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/DersTap.png"
              alt="DərsTap Logo"
              className="w-12 h-12 object-contain rounded-lg shadow-md"
            />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DərsTap</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-200">
              Ana Səhifə
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition duration-200">
                  Dashboard
                </Link>

                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition duration-200">
                    Admin Panel
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name} {user.surname}</span>
                    <i className="fas fa-chevron-down text-sm"></i>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-600">Rol: {user.role}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="fas fa-user mr-2"></i>
                        Profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Çıxış
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition duration-200">
                  Giriş
                </Link>
                <Link to="/register" className="btn-primary">
                  Qeydiyyat
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition duration-200"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-200" onClick={() => setIsMenuOpen(false)}>
                Ana Səhifə
              </Link>

              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition duration-200" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>

                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition duration-200" onClick={() => setIsMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {user.name} {user.surname} ({user.role})
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-blue-600 transition duration-200"
                    >
                      Çıxış
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 transition duration-200" onClick={() => setIsMenuOpen(false)}>
                    Giriş
                  </Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
                    Qeydiyyat
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
