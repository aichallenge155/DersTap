import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TeacherDashboard = ({ user }) => {
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    completedLessons: 0,
    profileViews: 0,
    monthlyEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      // Fetch teacher profile
      const profileResponse = await axios.get('/teachers/profile');
      setTeacherProfile(profileResponse.data);

      // Fetch teacher reviews
      const reviewsResponse = await axios.get(`/reviews/teacher/${profileResponse.data._id}`);
      setMyReviews(reviewsResponse.data);

      // Calculate stats
      const totalReviews = reviewsResponse.data.length;
      const averageRating = totalReviews > 0 
        ? reviewsResponse.data.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      setStats({
        totalReviews,
        averageRating,
        completedLessons: profileResponse.data.completedLessons || 0,
        profileViews: profileResponse.data.profileViews || 0,
        monthlyEarnings: 0 // This would be calculated from actual lesson data
      });
    } catch (error) {
      console.error('Müəllim məlumatları alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-gray-300"></i>);
    }

    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            Müəllim Dashboard-ı
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <i className="fas fa-star text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Orta Reytinq</p>
                <p className="text-2xl font-bold text-gray-800">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <i className="fas fa-comments text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ümumi Rəy</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <i className="fas fa-graduation-cap text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tamamlanmış Dərs</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completedLessons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-3">
                <i className="fas fa-eye text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Profil Baxışı</p>
                <p className="text-2xl font-bold text-gray-800">{stats.profileViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <i className="fas fa-money-bill-wave text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Bu Ay Gəlir</p>
                <p className="text-2xl font-bold text-gray-800">{stats.monthlyEarnings}₼</p>
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
                  to={`/teacher/${teacherProfile?._id}`}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition duration-200"
                >
                  <i className="fas fa-user text-2xl text-blue-600 mb-2"></i>
                  <span className="font-medium text-gray-700">Profilimi Gör</span>
                </Link>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition duration-200">
                  <i className="fas fa-edit text-2xl text-green-600 mb-2"></i>
                  <span className="font-medium text-gray-700">Profili Redaktə Et</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition duration-200">
                  <i className="fas fa-calendar text-2xl text-purple-600 mb-2"></i>
                  <span className="font-medium text-gray-700">Təqvim</span>
                </button>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                <i className="fas fa-user-circle mr-2 text-blue-600"></i>
                Profil Xülasəsi
              </h2>

              {teacherProfile && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                        {user.surname?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user.name} {user.surname}
                      </h3>
                      <p className="text-gray-600">{teacherProfile.education}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          {renderStars(stats.averageRating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({stats.totalReviews} rəy)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Təcrübə</p>
                      <p className="font-semibold">{teacherProfile.experience} il</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Şəhər</p>
                      <p className="font-semibold">{user.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Online Qiymət</p>
                      <p className="font-semibold text-green-600">{teacherProfile.onlineRate}₼/saat</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Offline Qiymət</p>
                      <p className="font-semibold text-green-600">{teacherProfile.offlineRate}₼/saat</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Fənnlər</p>
                    <div className="flex flex-wrap gap-2">
                      {teacherProfile.subjects?.map((subject, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                <i className="fas fa-comments mr-2 text-blue-600"></i>
                Son Rəylər
              </h2>

              {myReviews.length > 0 ? (
                <div className="space-y-4">
                  {myReviews.slice(0, 5).map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {review.studentId?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {review.studentId?.name} {review.studentId?.surname}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{review.subject}</span>
                                <span>•</span>
                                <span>{formatDate(review.lessonDate)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-comment-slash text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Hələ rəy yazılmayıb</p>
                </div>
              )}

              {myReviews.length > 5 && (
                <div className="text-center mt-4">
                  <Link
                    to={`/teacher/${teacherProfile?._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Bütün rəyləri gör ({myReviews.length})
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Performance Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-chart-line mr-2 text-green-600"></i>
                Performans
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profil Tamamlanma</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Müştəri Məmnuniyyəti</span>
                  <span className="font-semibold text-blue-600">{((stats.averageRating / 5) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(stats.averageRating / 5) * 100}%`}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aktivlik Səviyyəsi</span>
                  <span className="font-semibold text-purple-600">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
            </div>

            {/* Tips & Suggestions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
                Məsləhətlər
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Profil Şəkli</p>
                  <p className="text-xs text-blue-600">Peşəkar profil şəkli əlavə edin</p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Bio Məlumatı</p>
                  <p className="text-xs text-green-600">Özünüz haqqında ətraflı məlumat yazın</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium">Sertifikatlar</p>
                  <p className="text-xs text-purple-600">Təhsil sertifikatlarınızı yükləyin</p>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-headset mr-2 text-blue-600"></i>
                Dəstək
              </h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition duration-200">
                  <i className="fas fa-question-circle text-blue-600 mr-2"></i>
                  <span className="text-sm font-medium">Tez-tez Verilən Suallar</span>
                </button>

                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition duration-200">
                  <i className="fas fa-envelope text-green-600 mr-2"></i>
                  <span className="text-sm font-medium">Dəstək Komandası</span>
                </button>

                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition duration-200">
                  <i className="fas fa-book text-purple-600 mr-2"></i>
                  <span className="text-sm font-medium">İstifadə Təlimatı</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
