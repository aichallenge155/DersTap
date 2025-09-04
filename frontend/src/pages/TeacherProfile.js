import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewModal from '../components/ReviewModal';

const TeacherProfile = ({ user }) => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    fetchTeacherProfile();
    fetchTeacherReviews();
  }, [id]);

  const fetchTeacherProfile = async () => {
    try {
      const response = await axios.get(`/teachers/${id}`);
      setTeacher(response.data);
    } catch (error) {
      console.error('Müəllim profili alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherReviews = async () => {
    try {
      const response = await axios.get(`/reviews/teacher/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Rəylər alınmadı:', error);
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

  const handleReviewSubmitted = () => {
    fetchTeacherReviews();
    fetchTeacherProfile(); // Reytinqi yeniləmək üçün
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-user-times text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600">Müəllim tapılmadı</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Teacher Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-white">
                    {teacher.userId?.name?.charAt(0).toUpperCase()}
                    {teacher.userId?.surname?.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {teacher.userId?.name} {teacher.userId?.surname}
                </h1>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(teacher.rating)}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">
                    {teacher.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({teacher.totalReviews} rəy)
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${
                    teacher.userId?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {teacher.userId?.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                {teacher.isPremium && (
                  <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <i className="fas fa-crown mr-1"></i>
                    Premium Müəllim
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-map-marker-alt w-5 text-blue-600"></i>
                  <span className="ml-3">{teacher.userId?.city}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-graduation-cap w-5 text-blue-600"></i>
                  <span className="ml-3">{teacher.experience} il təcrübə</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-money-bill-wave w-5 text-blue-600"></i>
                  <span className="ml-3 font-semibold text-green-600">
                    {teacher.onlineRate && teacher.offlineRate 
                      ? `${teacher.onlineRate}-${teacher.offlineRate} ₼/saat`
                      : teacher.onlineRate 
                        ? `${teacher.onlineRate} ₼/saat (online)`
                        : teacher.offlineRate 
                          ? `${teacher.offlineRate} ₼/saat (offline)`
                          : 'Qiymət müəyyən edilməyib'
                    }
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-layer-group w-5 text-blue-600"></i>
                  <span className="ml-3">{teacher.grade}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-eye w-5 text-blue-600"></i>
                  <span className="ml-3">{teacher.profileViews} profil baxışı</span>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <a
                  href={`tel:${teacher.userId?.phone}`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg transition duration-200 font-medium flex items-center justify-center"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Zəng Et
                </a>
                
                <a
                  href={`https://wa.me/${teacher.userId?.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg transition duration-200 font-medium flex items-center justify-center"
                >
                  <i className="fab fa-whatsapp mr-2"></i>
                  WhatsApp
                </a>

                {user && user.role !== 'teacher' && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg transition duration-200 font-medium flex items-center justify-center"
                  >
                    <i className="fas fa-star mr-2"></i>
                    Rəy Yaz
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                <i className="fas fa-user mr-2 text-blue-600"></i>
                Haqqında
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Təhsil</h3>
                  <p className="text-gray-600">{teacher.education}</p>
                </div>

                {teacher.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
                    <p className="text-gray-600">{teacher.bio}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Fənnlər</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects?.map((subject, index) => (
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
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
                Statistika
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {teacher.completedLessons}
                  </div>
                  <div className="text-sm text-gray-600">Tamamlanmış Dərs</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {teacher.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Orta Reytinq</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {teacher.totalReviews}
                  </div>
                  <div className="text-sm text-gray-600">Ümumi Rəy</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {teacher.profileViews}
                  </div>
                  <div className="text-sm text-gray-600">Profil Baxışı</div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                <i className="fas fa-comments mr-2 text-blue-600"></i>
                Rəylər ({reviews.length})
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {review.studentId?.name?.charAt(0).toUpperCase()}
                            {review.studentId?.surname?.charAt(0).toUpperCase()}
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
                          
                          <p className="text-gray-700">{review.comment}</p>
                          
                          <div className="text-xs text-gray-500 mt-2">
                            {formatDate(review.createdAt)}
                          </div>
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
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        teacher={teacher}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default TeacherProfile;