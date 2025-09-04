import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SearchFilters from '../components/SearchFilters';
import TeacherCard from '../components/TeacherCard';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, [searchParams]);

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {};
      searchParams.forEach((value, key) => {
        if (value) params[key] = value;
      });

      const response = await axios.get('/teachers', { params });
      setTeachers(response.data);
    } catch (error) {
      console.error('Müəllimlər alınmadı:', error);
      setError('Müəllimlər yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      searchParams.set('subject', searchTerm);
    } else {
      searchParams.delete('subject');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Müəllim Axtarışı
          </h1>
          <p className="text-xl text-gray-600">
            Ən yaxşı müəllimləri tapın və dərslərə başlayın
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <SearchFilters 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Axtarış Nəticələri
            </h2>
            <span className="text-gray-600">
              {loading ? 'Yüklənir...' : `${teachers.length} müəllim tapıldı`}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Müəllimlər yüklənir...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && teachers.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Heç bir müəllim tapılmadı
            </h3>
            <p className="text-gray-600 mb-6">
              Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin
            </p>
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Bütün Müəllimləri Göstər
            </button>
          </div>
        )}

        {/* Teachers Grid */}
        {!loading && teachers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher._id} teacher={teacher} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
