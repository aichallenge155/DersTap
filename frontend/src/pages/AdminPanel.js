import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ user }) => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'teachers') fetchTeachers();
    else if (activeTab === 'reviews') fetchPendingReviews();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Statistikalar alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('İstifadəçilər alınmadı:', error);
      setUsers([]);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/admin/teachers');
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Müəllimlər alınmadı:', error);
      setTeachers([]);
    }
  };

  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get('/admin/reviews/pending');
      setPendingReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Gözləyən rəylər alınmadı:', error);
      setPendingReviews([]);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/admin/users/${userId}/status`, {
        isActive: !currentStatus
      });
      fetchUsers();
      alert('İstifadəçi statusu yeniləndi');
    } catch (error) {
      console.error('Xəta:', error);
      alert('Xəta baş verdi');
    }
  };

  const toggleTeacherVerification = async (teacherId, currentStatus) => {
    try {
      await axios.put(`/admin/teachers/${teacherId}/verify`, {
        isVerified: !currentStatus
      });
      fetchTeachers();
      alert('Müəllim statusu yeniləndi');
    } catch (error) {
      console.error('Xəta:', error);
      alert('Xəta baş verdi');
    }
  };

  const approveReview = async (reviewId, approve) => {
    try {
      await axios.put(`/admin/reviews/${reviewId}/approve`, {
        isApproved: approve
      });
      fetchPendingReviews();
      alert(approve ? 'Rəy təsdiqləndi' : 'Rəy rədd edildi');
    } catch (error) {
      console.error('Xəta:', error);
      alert('Xəta baş verdi');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`fas fa-star ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        ></i>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <i className="fas fa-cogs mr-3 text-blue-600"></i>
            Admin Panel
          </h1>
          <p className="text-gray-600">
            DərsTap platformasının idarə paneli
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'tachometer-alt' },
                { id: 'users', label: 'İstifadəçilər', icon: 'users' },
                { id: 'teachers', label: 'Müəllimlər', icon: 'chalkboard-teacher' },
                { id: 'reviews', label: 'Rəylər', icon: 'comments' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className={`fas fa-${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Statistikalar</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-3">
                        <i className="fas fa-users text-blue-600 text-xl"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-blue-600">Ümumi İstifadəçi</p>
                        <p className="text-2xl font-bold text-blue-800">{stats.totalUsers || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-3">
                        <i className="fas fa-chalkboard-teacher text-green-600 text-xl"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-green-600">Müəllim Sayı</p>
                        <p className="text-2xl font-bold text-green-800">{stats.totalTeachers || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-3">
                        <i className="fas fa-graduation-cap text-purple-600 text-xl"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-purple-600">Tələbə Sayı</p>
                        <p className="text-2xl font-bold text-purple-800">{stats.totalStudents || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <div className="bg-orange-100 rounded-full p-3">
                        <i className="fas fa-comments text-orange-600 text-xl"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-orange-600">Ümumi Rəy</p>
                        <p className="text-2xl font-bold text-orange-800">{stats.totalReviews || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Items */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                    <i className="fas fa-clock mr-2"></i>
                    Gözləyən Əməliyyatlar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{stats.pendingReviews || 0}</p>
                      <p className="text-sm text-yellow-700">Gözləyən Rəy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">0</p>
                      <p className="text-sm text-yellow-700">Yeni Müəllim</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">0</p>
                      <p className="text-sm text-yellow-700">Şikayət</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">İstifadəçilər ({users.length})</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İstifadəçi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Şəhər
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Əməliyyatlar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.length > 0 ? users.map((userItem) => (
                        <tr key={userItem._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {userItem.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {userItem.name} {userItem.surname}
                                </div>
                                <div className="text-sm text-gray-500">{userItem.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userItem.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                              userItem.role === 'student' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {userItem.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {userItem.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userItem.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {userItem.isActive ? 'Aktiv' : 'Deaktiv'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleUserStatus(userItem._id, userItem.isActive)}
                              className={`${
                                userItem.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {userItem.isActive ? 'Deaktiv et' : 'Aktiv et'}
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            İstifadəçi yoxdur
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Müəllimlər ({teachers.length})</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Müəllim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fənnlər
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reytinq
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Əməliyyatlar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.length > 0 ? teachers.map((teacher) => (
                        <tr key={teacher._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {teacher.userId?.name?.charAt(0).toUpperCase() || 'T'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {teacher.userId?.name || 'N/A'} {teacher.userId?.surname || ''}
                                </div>
                                <div className="text-sm text-gray-500">{teacher.userId?.email || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects?.slice(0, 2).map((subject, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                  {subject}
                                </span>
                              ))}
                              {teacher.subjects?.length > 2 && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                                  +{teacher.subjects.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex items-center space-x-1">
                                {renderStars(teacher.rating || 0)}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {(teacher.rating || 0).toFixed(1)} ({teacher.totalReviews || 0})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                teacher.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {teacher.isVerified ? 'Təsdiqlənmiş' : 'Gözlənilir'}
                              </span>
                              {teacher.isPremium && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                                  Premium
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleTeacherVerification(teacher._id, teacher.isVerified)}
                              className={`${
                                teacher.isVerified ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {teacher.isVerified ? 'Təsdiqi ləğv et' : 'Təsdiqlə'}
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            Müəllim yoxdur
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Gözləyən Rəylər ({pendingReviews.length})</h2>
                </div>

                {pendingReviews.length > 0 ? (
                  <div className="space-y-4">
                    {pendingReviews.map((review) => (
                      <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {review.studentId?.name?.charAt(0).toUpperCase() || 'S'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {review.studentId?.name || 'N/A'} {review.studentId?.surname || ''}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {review.teacherId?.userId?.name || 'N/A'} {review.teacherId?.userId?.surname || ''} haqqında
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating || 0)}
                              </div>
                              <span className="text-sm text-gray-600">{review.subject || 'N/A'}</span>
                              <span className="text-sm text-gray-600">
                                {review.lessonDate ? new Date(review.lessonDate).toLocaleDateString('az-AZ') : 'N/A'}
                              </span>
                            </div>

                            <p className="text-gray-700 mb-4">{review.comment || 'Şərh yoxdur'}</p>

                            <div className="text-xs text-gray-500">
                              {review.createdAt ? formatDate(review.createdAt) : 'N/A'}
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 ml-6">
                            <button
                              onClick={() => approveReview(review._id, true)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                            >
                              <i className="fas fa-check mr-1"></i>
                              Təsdiqlə
                            </button>
                            <button
                              onClick={() => approveReview(review._id, false)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                            >
                              <i className="fas fa-times mr-1"></i>
                              Rədd et
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-clipboard-check text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Gözləyən rəy yoxdur
                    </h3>
                    <p className="text-gray-500">
                      Bütün rəylər təsdiqlənmişdir
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;