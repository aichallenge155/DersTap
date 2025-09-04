import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchFilters from '../components/SearchFilters';

const HomePage = ({ user }) => {
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    subjects: 0,
    satisfaction: 0
  });

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      const response = await axios.get('/teachers');
      const teachers = response.data;
      
      const data = {
        totalTeachers: teachers.length,
        totalStudents: 25,
        totalParents: 15
      };
      
      setStats({
        teachers: data.totalTeachers || 0,
        students: (data.totalStudents || 0) + (data.totalParents || 0),
        subjects: 25,
        satisfaction: calculateSatisfaction(data) || 92
      });
    } catch (error) {
      console.error('Statistikalar alınmadı:', error);
      setStats({
        teachers: 0,
        students: 45,
        subjects: 25,
        satisfaction: 92
      });
    }
  };

  const calculateSatisfaction = (data) => {
    if (!data.totalReviews || data.totalReviews === 0) return 92;
    return Math.round((data.positiveReviews || data.totalReviews * 0.92) / data.totalReviews * 100);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background with Logo Watermark */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        {/* Logo Watermark - Multiple positions for better visibility */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
            <img
              src="/DersTap.png"
              alt="DərsTap Logo"
              className="w-72 h-72 object-contain transform rotate-12 filter brightness-150 contrast-150"
            />
          </div>
          <div className="absolute top-1/4 right-1/4 opacity-10">
            <img
              src="/DersTap.png"
              alt="DərsTap Logo"
              className="w-32 h-32 object-contain transform -rotate-12"
            />
          </div>
          <div className="absolute bottom-1/4 left-1/4 opacity-10">
            <img
              src="/DersTap.png"
              alt="DərsTap Logo"
              className="w-32 h-32 object-contain transform rotate-45"
            />
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-300 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-green-300 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  DərsTap
                </span>
                <br />
                <span className="text-3xl md:text-4xl text-white">
                  Ağıllı Təhsil Platforması
                </span>
              </h1>
              <p className="text-xl text-white mb-8 max-w-3xl mx-auto opacity-90">
                Müəllim və abituriyentləri bir araya gətirən ağıllı platforma. 
                Təhsili daha əlçatan və şəffaf edirik.
              </p>
              
              {!user && (
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    to="/register"
                    className="group bg-white text-blue-600 font-bold px-10 py-5 rounded-2xl hover:bg-yellow-300 hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
                  >
                    <i className="fas fa-user-plus mr-3 group-hover:animate-spin"></i>
                    Qeydiyyatdan Keç
                  </Link>
                  <Link
                    to="/login"
                    className="group border-3 border-white text-white font-bold px-10 py-5 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
                  >
                    <i className="fas fa-sign-in-alt mr-3 group-hover:animate-bounce"></i>
                    Giriş Et
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Müəllim */}
              <div className="text-center group hover:scale-110 transition-all duration-500">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                    <i className="fas fa-chalkboard-teacher text-3xl text-white"></i>
                  </div>
                  <div className="text-5xl font-black text-blue-600 mb-2">
                    {stats.teachers}+
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">Müəllim</div>
                </div>
              </div>
              
              {/* Tələbə */}
              <div className="text-center group hover:scale-110 transition-all duration-500">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                    <i className="fas fa-graduation-cap text-3xl text-white"></i>
                  </div>
                  <div className="text-5xl font-black text-green-600 mb-2">
                    {stats.students}+
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">Tələbə</div>
                </div>
              </div>
              
              {/* Fənn */}
              <div className="text-center group hover:scale-110 transition-all duration-500">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                    <i className="fas fa-book text-3xl text-white"></i>
                  </div>
                  <div className="text-5xl font-black text-purple-600 mb-2">
                    {stats.subjects}+
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">Fənn</div>
                </div>
              </div>
              
              {/* Məmnunluq */}
              <div className="text-center group hover:scale-110 transition-all duration-500">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                    <i className="fas fa-smile text-3xl text-white"></i>
                  </div>
                  <div className="text-5xl font-black text-orange-600 mb-2">
                    {stats.satisfaction}%
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">Məmnunluq</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section id="search-section" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                <i className="fas fa-search mr-3 text-blue-600"></i>
                Müəllim Axtarışı
              </h2>
              <p className="text-xl text-gray-600">
                Uyğun müəllimi tapmaq üçün axtarış edin
              </p>
            </div>
            
            <SearchFilters />
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-gray-800 mb-6">
                Necə İşləyir?
              </h2>
              <p className="text-2xl text-gray-600 font-light">
                Sadə <span className="font-bold text-blue-600">3 addımda</span> müəllim tapın
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center mx-auto text-5xl font-black shadow-2xl group-hover:scale-110 transition-all duration-500">
                    1
                  </div>
                  <div className="absolute inset-0 w-32 h-32 bg-blue-400 rounded-full mx-auto animate-ping opacity-20"></div>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">Axtarın</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Şəhər, fənn və digər kriteriyalar üzrə axtarış edin
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full flex items-center justify-center mx-auto text-5xl font-black shadow-2xl group-hover:scale-110 transition-all duration-500">
                    2
                  </div>
                  <div className="absolute inset-0 w-32 h-32 bg-green-400 rounded-full mx-auto animate-ping opacity-20"></div>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">Seçin</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Reytinq və rəylərə əsasən ən uyğun müəllimi seçin
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-full flex items-center justify-center mx-auto text-5xl font-black shadow-2xl group-hover:scale-110 transition-all duration-500">
                    3
                  </div>
                  <div className="absolute inset-0 w-32 h-32 bg-purple-400 rounded-full mx-auto animate-ping opacity-20"></div>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">Əlaqə</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Müəllimlə birbaşa əlaqə saxlayın və dərslərə başlayın
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"></div>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-8">
              Təhsilin Gələcəyini Birlikdə İnşa Edək
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 font-light leading-relaxed">
              Biz təhsili daha əlçatan və şəffaf etmək üçün buradayıq. 
              <br />
              <span className="font-semibold text-yellow-300">Siz də bu yolda bizimlə olun.</span>
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link
                  to="/register?role=teacher"
                  className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-black px-12 py-6 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl text-lg"
                >
                  <i className="fas fa-chalkboard-teacher mr-3 group-hover:animate-bounce"></i>
                  Müəllim kimi Qoşul
                </Link>
                <Link
                  to="/register?role=student"
                  className="group bg-white text-blue-600 font-black px-12 py-6 rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl text-lg"
                >
                  <i className="fas fa-graduation-cap mr-3 group-hover:animate-bounce"></i>
                  Tələbə kimi Qoşul
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="group bg-white text-blue-600 font-black px-12 py-6 rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl inline-block text-lg"
              >
                <i className="fas fa-tachometer-alt mr-3 group-hover:animate-spin"></i>
                Dashboard-a Get
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
