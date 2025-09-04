import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TeacherCard = ({ teacher }) => {
  const [showPhone, setShowPhone] = useState(false);

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

  const getDisplayPrice = () => {
    const modes = teacher.teachingMode || [];
    const onlineRate = teacher.onlineRate || 0;
    const offlineRate = teacher.offlineRate || 0;

    if (modes.includes('online') && modes.includes('offline')) {
      const minPrice = Math.min(onlineRate, offlineRate);
      const maxPrice = Math.max(onlineRate, offlineRate);
      return `${minPrice}-${maxPrice} ₼/saat`;
    } else if (modes.includes('online')) {
      return `${onlineRate} ₼/saat (Online)`;
    } else if (modes.includes('offline')) {
      return `${offlineRate} ₼/saat (Offline)`;
    } else {
      // Fallback - əgər köhnə sistem varsa
      return `${teacher.hourlyRate || 0} ₼/saat`;
    }
  };

  const getTeachingModeDisplay = () => {
    const modes = teacher.teachingMode || [];
    if (modes.includes('online') && modes.includes('offline')) {
      return (
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <i className="fas fa-video mr-1"></i>
            Online
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <i className="fas fa-chalkboard-teacher mr-1"></i>
            Offline
          </span>
        </div>
      );
    } else if (modes.includes('online')) {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit">
          <i className="fas fa-video mr-1"></i>
          Online Dərslər
        </span>
      );
    } else if (modes.includes('offline')) {
      return (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit">
          <i className="fas fa-chalkboard-teacher mr-1"></i>
          Offline Dərslər
        </span>
      );
    } else {
      return (
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
          Dərs növü qeyd olunmayıb
        </span>
      );
    }
  };

  const handlePhoneClick = (e) => {
    e.preventDefault();
    setShowPhone(!showPhone);
  };

  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  return (
    <div className="teacher-card relative group">
      {/* Premium Badge */}
      {teacher.isPremium && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10 animate-pulse">
          <i className="fas fa-crown mr-1"></i>
          Premium
        </div>
      )}

      {/* Online Status */}
      <div className={`absolute top-4 right-4 ${teacher.userId?.isOnline ? "online-indicator" : "offline-indicator"}`}>
        <div className={`w-3 h-3 rounded-full ${teacher.userId?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg group-hover:scale-110 transition-all duration-300">
          {teacher.userId?.name?.charAt(0).toUpperCase()}
          {teacher.userId?.surname?.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-xl font-bold text-gray-800 text-center leading-tight">
          {teacher.userId?.name} {teacher.userId?.surname}
        </h3>
        {teacher.isVerified && (
          <div className="flex items-center mt-1 text-blue-600">
            <i className="fas fa-check-circle text-sm mr-1"></i>
            <span className="text-xs font-medium">Təsdiqlənmiş</span>
          </div>
        )}
      </div>

      {/* Teacher Info */}
      <div className="space-y-4">
        {/* Subjects */}
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Fənnlər:</p>
          <div className="flex flex-wrap gap-1">
            {teacher.subjects?.slice(0, 2).map((subject, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
              >
                {subject}
              </span>
            ))}
            {teacher.subjects?.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                +{teacher.subjects.length - 2} daha
              </span>
            )}
          </div>
        </div>

        {/* Teaching Mode */}
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Dərs növü:</p>
          {getTeachingModeDisplay()}
        </div>

        {/* Experience & Location */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <i className="fas fa-graduation-cap mr-2 text-blue-600"></i>
            <span>{teacher.experience} il təcrübə</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
            <span>{teacher.userId?.city}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {renderStars(teacher.rating || 0)}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({teacher.totalReviews || 0})
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {getDisplayPrice()}
            </div>
          </div>
        </div>

        {/* Grade */}
        <div className="text-center">
          <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
            {teacher.grade}
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-500 border-t pt-3 bg-gray-50 -mx-6 px-6 rounded-b-2xl">
          <span className="flex items-center">
            <i className="fas fa-eye mr-1 text-blue-500"></i>
            {teacher.profileViews || 0} baxış
          </span>
          <span className="flex items-center">
            <i className="fas fa-check-circle mr-1 text-green-500"></i>
            {teacher.completedLessons || 0} dərs
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pt-4">
          <Link
            to={`/teacher/${teacher._id}`}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg"
          >
            <i className="fas fa-user mr-2"></i>
            Profili Gör
          </Link>

          {/* Phone Contact */}
          <div className="w-full">
            {isMobile() ? (
              // Mobile - direct call
              <a
                href={`tel:${teacher.userId?.phone}`}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg block"
              >
                <i className="fas fa-phone mr-2"></i>
                Zəng Et
              </a>
            ) : (
              // Desktop - show number
              <button
                onClick={handlePhoneClick}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg"
              >
                <i className="fas fa-phone mr-2"></i>
                {showPhone ? teacher.userId?.phone : 'Telefonu Göstər'}
              </button>
            )}
          </div>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${teacher.userId?.phone?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg"
          >
            <i className="fab fa-whatsapp mr-2"></i>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;