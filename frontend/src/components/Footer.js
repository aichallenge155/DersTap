import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo və Məlumat */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/DersTap.png"
                alt="DərsTap Logo"
                className="w-12 h-12 object-contain rounded-lg shadow-md"
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">DərsTap</span>
            </div>
            <p className="text-gray-400 text-sm">
              Müəllim və abituriyentləri bir araya gətirən ağıllı platforma. 
              Təhsili daha əlçatan və şəffaf edirik.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
            </div>
          </div>

          {/* Linklər */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Linklər</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition duration-200">
                  Ana Səhifə
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="text-gray-400 hover:text-white transition duration-200">
                  Müəllimlər
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition duration-200">
                  Haqqımızda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition duration-200">
                  Əlaqə
                </Link>
              </li>
            </ul>
          </div>

          {/* Xidmətlər */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Xidmətlər</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Fərdi Dərslər</li>
              <li className="text-gray-400">Qrup Dərsləri</li>
              <li className="text-gray-400">Online Dərslər</li>
              <li className="text-gray-400">Sınaq Dərsləri</li>
            </ul>
          </div>

          {/* Əlaqə Məlumatları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Əlaqə</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                info@derstap.az
              </li>
              <li className="text-gray-400 flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Şirvan, Azərbaycan
              </li>
            </ul>
          </div>
        </div>

        {/* Alt hissə */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 DərsTap. Bütün hüquqlar qorunur.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition duration-200">
              Məxfilik Siyasəti
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition duration-200">
              İstifadə Şərtləri
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
