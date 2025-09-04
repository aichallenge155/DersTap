import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchFilters = ({ onFilterChange, onSearch }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    city: '',
    subject: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    grade: '',
    teachingMode: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Azərbaycanın bütün regionları
  const cities = [
    // Bakı iqtisadi rayonu
    'Bakı', 'Sumqayıt', 'Abşeron', 'Xızı',
    
    // Aran iqtisadi rayonu
    'Ağcabədi', 'Ağdaş', 'Bərdə', 'Biləsuvar', 'Göyçay', 'Hacıqabul', 
    'İmişli', 'Kürdəmir', 'Neftçala', 'Saatli', 'Sabirabad', 'Salyan', 
    'Ucar', 'Yevlax', 'Zərdab', 'Mingəçevir', 'Şirvan',
    
    // Gəncə-Qazax iqtisadi rayonu
    'Gəncə', 'Ağstafa', 'Daşkəsən', 'Gədəbəy', 'Goranboy', 'Göygöl', 
    'Qazax', 'Naftalan', 'Samux', 'Şəmkir', 'Tovuz',
    
    // Şəki-Zaqatala iqtisadi rayonu
    'Şəki', 'Balakən', 'Qəbələ', 'Qax', 'Quba', 'Qudyalçay', 
    'Qusar', 'Oğuz', 'Zaqatala',
    
    // Quba-Xaçmaz iqtisadi rayonu
    'Xaçmaz', 'Siyəzən', 'Şabran',
    
    // Lənkəran iqtisadi rayonu
    'Lənkəran', 'Astara', 'Cəlilabad', 'Lerik', 'Masallı', 'Yardımlı',
    
    // Dağlıq Şirvan iqtisadi rayonu
    'İsmayıllı', 'Ağsu', 'Şamaxı',
    
    // Naxçıvan Muxtar Respublikası
    'Naxçıvan', 'Babək', 'Culfa', 'Kəngərli', 'Ordubad', 'Sədərək', 'Şahbuz', 'Şərur',
    
    // Qarabağ bölgəsi (azad edilmiş ərazilər)
    'Şuşa', 'Xankəndi', 'Ağdam', 'Füzuli', 'Cəbrayıl', 'Qubadlı', 
    'Zəngilan', 'Laçın', 'Kəlbəcər', 'Ağdərə', 'Xocalı', 'Xocavənd', 'Tərtər'
  ].sort(); // Alfabetik sıraya sal

  const subjects = [
    'Riyaziyyat', 'Fizika', 'Kimya', 'Biologiya', 'İngilis dili',
    'Rus dili', 'Azərbaycan dili', 'Tarix', 'Coğrafiya', 'İnformatika',
    'Ədəbiyyat', 'Həndəsə', 'Cəbr', 'Trigonometriya', 'Astronomiya',
    'Fəlsəfə', 'Psixologiya', 'İqtisadiyyat', 'Hüquq', 'Tibb',
    'Musiqi', 'Rəsm', 'İdman', 'Fransız dili', 'Alman dili'
  ].sort();

  const grades = [
    '1-4 sinif', '5-9 sinif', '10-11 sinif', 'Abituriyent', 
    'Universitet', 'Magistratura', 'Doktorantura'
  ];

  const teachingModes = [
    { value: 'online', label: 'Online Dərslər', icon: 'video' },
    { value: 'offline', label: 'Offline Dərslər', icon: 'chalkboard-teacher' },
    { value: 'both', label: 'Hər İkisi', icon: 'laptop-house' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create search params
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set('subject', searchTerm);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    
    // Navigate to search results page
    navigate(`/search?${searchParams.toString()}`);
    
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      city: '',
      subject: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      grade: '',
      teachingMode: ''
    };
    setFilters(emptyFilters);
    setSearchTerm('');
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== '';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-100 hover:shadow-2xl transition-all duration-500">


      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"></i>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Müəllim adı və ya fənn axtarın..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 outline-none transition-all duration-300 text-lg hover:border-gray-400"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-4 hover:scale-110 transition-transform duration-300"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
              <i className="fas fa-search"></i>
            </div>
          </button>
        </div>
      </form>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Şəhər */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            <i className="fas fa-map-marker-alt mr-2"></i>
            Şəhər
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="input-field hover:scale-105 transition-all duration-300"
          >
            <option value="">Bütün şəhərlər</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Fənn */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            <i className="fas fa-book mr-2"></i>
            Fənn
          </label>
          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className="input-field hover:scale-105 transition-all duration-300"
          >
            <option value="">Bütün fənnlər</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Tədris Növü */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            <i className="fas fa-laptop mr-2"></i>
            Tədris Növü
          </label>
          <select
            value={filters.teachingMode}
            onChange={(e) => handleFilterChange('teachingMode', e.target.value)}
            className="input-field hover:scale-105 transition-all duration-300"
          >
            <option value="">Hər hansı</option>
            {teachingModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sinif/Səviyyə */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            <i className="fas fa-graduation-cap mr-2"></i>
            Sinif/Səviyyə
          </label>
          <select
            value={filters.grade}
            onChange={(e) => handleFilterChange('grade', e.target.value)}
            className="input-field hover:scale-105 transition-all duration-300"
          >
            <option value="">Bütün səviyyələr</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        {/* Minimum Qiymət */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            <i className="fas fa-money-bill-wave mr-2"></i>
            Min. Qiymət (₼/saat)
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            placeholder="0"
            className="input-field hover:scale-105 transition-all duration-300"
            min="0"
          />
        </div>

        {/* Maksimum Qiymət */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            <i className="fas fa-money-bill-wave mr-2"></i>
            Max. Qiymət (₼/saat)
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            placeholder="100"
            className="input-field hover:scale-105 transition-all duration-300"
            min="0"
          />
        </div>

        {/* Minimum Reytinq */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            <i className="fas fa-star mr-2"></i>
            Min. Reytinq
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            className="input-field hover:scale-105 transition-all duration-300"
          >
            <option value="">Bütün reytinqlər</option>
            <option value="4.5">4.5+ ulduz</option>
            <option value="4">4+ ulduz</option>
            <option value="3.5">3.5+ ulduz</option>
            <option value="3">3+ ulduz</option>
          </select>
        </div>

        {/* Clear Button */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              hasActiveFilters 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <i className="fas fa-times mr-2"></i>
            Filterləri Təmizlə
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            <i className="fas fa-filter mr-2"></i>
            Aktiv Filterlər:
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <i className="fas fa-search mr-1"></i>
                "{searchTerm}"
                <button 
                  onClick={() => { setSearchTerm(''); onSearch(''); }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              const labels = {
                city: 'Şəhər',
                subject: 'Fənn',
                teachingMode: 'Tədris',
                grade: 'Səviyyə',
                minPrice: 'Min. qiymət',
                maxPrice: 'Max. qiymət',
                minRating: 'Min. reytinq'
              };
              return (
                <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {labels[key]}: {value}
                  <button 
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;