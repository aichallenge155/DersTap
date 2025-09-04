import React, { useState } from 'react';
import axios from 'axios';

const ReviewModal = ({ isOpen, onClose, teacher, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    subject: '',
    lessonDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/reviews', {
        teacherId: teacher._id,
        ...formData
      });

      alert('Rəyiniz uğurla göndərildi! Admin təsdiqi gözlənilir.');
      onReviewSubmitted();
      onClose();
      setFormData({
        rating: 5,
        comment: '',
        subject: '',
        lessonDate: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Rəy Yazın
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Teacher Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {teacher.userId?.name?.charAt(0).toUpperCase()}
                {teacher.userId?.surname?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {teacher.userId?.name} {teacher.userId?.surname}
                </h3>
                <p className="text-sm text-gray-600">
                  {teacher.subjects?.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reytinq */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reytinq
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-2xl transition duration-200 ${
                      star <= formData.rating 
                        ? 'text-yellow-400 hover:text-yellow-500' 
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({formData.rating} ulduz)
                </span>
              </div>
            </div>

            {/* Fənn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dərs Fənni
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Fənn seçin</option>
                {teacher.subjects?.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Dərs Tarixi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dərs Tarixi
              </label>
              <input
                type="date"
                name="lessonDate"
                value={formData.lessonDate}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            {/* Şərh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şərhiniz
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Müəllim haqqında şərhinizi yazın..."
                className="input-field resize-none"
                maxLength="500"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {formData.comment.length}/500 simvol
              </p>
            </div>

            {/* Düymələr */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Ləğv et
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Göndərilir...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Rəy Göndər
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;