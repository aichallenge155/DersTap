import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TeacherCard from '../components/TeacherCard';

const StudentDashboard = ({ user }) => {
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Bu API endpoint-lər backend-də əlavə ediləcək
      // const [favorites, reviews, recent] = await Promise.all([
      //   axios.get('/students/favorites'),
      //   axios.get('/students/my-reviews'),
      //   axios.get('/students/recently-viewed')
      // ]);
      
      // setFavoriteTeachers(favorites.data);
      // setMyReviews(reviews.data);
      // setRecentlyViewed(recent.data);
    } catch (error) {
      console.error('Dashboard məlumatları alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Xoş gəldiniz, {user.name}!
          </h1>
          <p className="text-gray-600">
            {user.role === 'student' ? 'Tələbə' : 'Valideyn'} Dashboard-ı
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <i className="fas fa-heart text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Sevimlilər</p>
                <p className="text-2xl font-bold text-gray-800">{favoriteTeachers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <i className="fas fa-star text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Yazdığım Rəylər</p>
                <p className="text-2xl font-bold text-gray-800">{myReviews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <i className="fas fa-eye text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Son Baxdıqlarım</p>
                <p className="text-2xl font-bold text-gray-800">{recentlyViewed.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-3">
                <i className="fas fa-calendar text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Bu Ay Dərslər</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                <i className="fas fa-bolt mr-2 text-yellow-500"></i>
                Tez Əməliyyatlar
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition duration-200"
                >
                  <i className="fas fa-search text-2xl text-blue-600 mb-2"></i>
                  <span className="font-medium text-gray-700">Müəllim Axtar</span>
                </Link>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition duration-200">
                  <i className="fas fa-calendar-plus text-2xl text-green-600 mb-2"></i>
                  <span className="font-medium text-gray-700">Dərs Planla</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition duration-200">
                  <i className="fas fa-history text-2xl text-purple-600 mb-2"></i>
                  <span className="font-medium text-gray-700">Tarixçə</span>
                </button>
              </div>
            </div>

            {/* Recently Viewed Teachers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                <i className="fas fa-clock mr-2 text-blue-600"></i>
                Son Baxılan Müəllimlər
              </h2>

              {recentlyViewed.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentlyViewed.slice(0, 4).map((teacher) => (
                    <TeacherCard key={teacher._id} teacher={teacher} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-clock text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Hələ heç bir müəllimə baxmamışsınız</p>
                  <Link to="/" className="btn-primary mt-4 inline-block">
                    Müəllim Axtarmağa Başlayın
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-user mr-2 text-blue-600"></i>
                Profil Xülasəsi
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ad:</span>
                  <span className="font-medium">{user.name} {user.surname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-sm">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Şəhər:</span>
                  <span className="font-medium">{user.city}</span>
                </div>
              </div>
              
              <button className="w-full btn-primary mt-4">
                <i className="fas fa-edit mr-2"></i>
                Profili Redaktə Et
              </button>
            </div>

            {/* Favorite Teachers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-heart mr-2 text-red-500"></i>
                Sevimli Müəllimlər
              </h3>

              {favoriteTeachers.length > 0 ? (
                <div className="space-y-3">
                  {favoriteTeachers.slice(0, 3).map((teacher) => (
                    <div key={teacher._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {teacher.userId?.name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {teacher.userId?.name} {teacher.userId?.surname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {teacher.subjects?.[0]} • {teacher.onlineRate || teacher.offlineRate}₼/saat
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <i className="fas fa-heart-broken text-3xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500 text-sm">Sevimli müəlliminiz yoxdur</p>
                </div>
              )}

              {favoriteTeachers.length > 3 && (
                <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-3">
                  Hamısını Gör ({favoriteTeachers.length})
                </button>
              )}
            </div>

            {/* My Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-star mr-2 text-yellow-500"></i>
                Son Rəylərim
              </h3>

              {myReviews.length > 0 ? (
                <div className="space-y-3">
                  {myReviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          {review.teacherName}
                        </span>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <i key={i} className="fas fa-star text-yellow-400 text-xs"></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <i className="fas fa-comment-slash text-3xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500 text-sm">Hələ rəy yazmamışsınız</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;