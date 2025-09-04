import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'student',
    phone: '',
    city: ''
  });

  const [teacherData, setTeacherData] = useState({
    subjects: [],
    experience: '',
    education: '',
    teachingMode: [],
    onlineRate: '',
    offlineRate: '',
    grade: '',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Azərbaycanın bütün regionları
  const cities = [
    'Bakı', 'Sumqayıt', 'Abşeron', 'Xızı', 'Ağcabədi', 'Ağdaş', 'Bərdə', 'Biləsuvar', 
    'Göyçay', 'Hacıqabul', 'İmişli', 'Kürdəmir', 'Neftçala', 'Saatli', 'Sabirabad', 
    'Salyan', 'Ucar', 'Yevlax', 'Zərdab', 'Mingəçevir', 'Şirvan', 'Gəncə', 'Ağstafa', 
    'Daşkəsən', 'Gədəbəy', 'Goranboy', 'Göygöl', 'Qazax', 'Naftalan', 'Samux', 'Şəmkir', 
    'Tovuz', 'Şəki', 'Balakən', 'Qəbələ', 'Qax', 'Quba', 'Qudyalçay', 'Qusar', 'Oğuz', 
    'Zaqatala', 'Xaçmaz', 'Siyəzən', 'Şabran', 'Lənkəran', 'Astara', 'Cəlilabad', 'Lerik', 
    'Masallı', 'Yardımlı', 'İsmayıllı', 'Ağsu', 'Şamaxı', 'Naxçıvan', 'Babək', 'Culfa', 
    'Kəngərli', 'Ordubad', 'Sədərək', 'Şahbuz', 'Şərur', 'Şuşa', 'Xankəndi', 'Ağdam', 
    'Füzuli', 'Cəbrayıl', 'Qubadlı', 'Zəngilan', 'Laçın', 'Kəlbəcər', 'Ağdərə', 'Xocalı', 
    'Xocavənd', 'Tərtər'
  ].sort();

  const subjects = [
    'Riyaziyyat', 'Fizika', 'Kimya', 'Biologiya', 'İngilis dili', 'Rus dili', 'Azərbaycan dili', 
    'Tarix', 'Coğrafiya', 'İnformatika', 'Ədəbiyyat', 'Həndəsə', 'Cəbr', 'Trigonometriya',
    'Astronomiya', 'Fəlsəfə', 'Psixologiya', 'İqtisadiyyat', 'Hüquq', 'Tibb', 'Musiqi', 
    'Rəsm', 'İdman', 'Fransız dili', 'Alman dili'
  ].sort();

  const grades = [
    '1-4 sinif', '5-9 sinif', '10-11 sinif', 'Abituriyent', 
    'Universitet', 'Magistratura', 'Doktorantura'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTeacherDataChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value
    });
  };

  // Fənn seçimi üçün yeni metod
  const handleSubjectToggle = (subject) => {
    const currentSubjects = teacherData.subjects;
    if (currentSubjects.includes(subject)) {
      setTeacherData({
        ...teacherData,
        subjects: currentSubjects.filter(s => s !== subject)
      });
    } else {
      setTeacherData({
        ...teacherData,
        subjects: [...currentSubjects, subject]
      });
    }
  };

  // Tədris növü seçimi
  const handleTeachingModeToggle = (mode) => {
    const currentModes = teacherData.teachingMode;
    if (currentModes.includes(mode)) {
      setTeacherData({
        ...teacherData,
        teachingMode: currentModes.filter(m => m !== mode)
      });
    } else {
      setTeacherData({
        ...teacherData,
        teachingMode: [...currentModes, mode]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Form validasiyası
    if (formData.password !== formData.confirmPassword) {
      setError('Şifrələr uyğun gəlmir');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifrə ən azı 6 simvol olmalıdır');
      setLoading(false);
      return;
    }

    // Müəllim məlumatları validasiyası
    if (formData.role === 'teacher') {
      if (teacherData.subjects.length === 0) {
        setError('Ən azı bir fənn seçin');
        setLoading(false);
        return;
      }
      if (teacherData.teachingMode.length === 0) {
        setError('Ən azı bir tədris növü seçin');
        setLoading(false);
        return;
      }
      if (!teacherData.experience || !teacherData.education || !teacherData.grade) {
        setError('Bütün məcburi müəllim məlumatlarını doldurun');
        setLoading(false);
        return;
      }
      
      // Qiymət validasiyası
      if (teacherData.teachingMode.includes('online') && !teacherData.onlineRate) {
        setError('Online dərs qiymətini daxil edin');
        setLoading(false);
        return;
      }
      if (teacherData.teachingMode.includes('offline') && !teacherData.offlineRate) {
        setError('Offline dərs qiymətini daxil edin');
        setLoading(false);
        return;
      }
    }

    try {
      const requestData = {
        ...formData,
        ...(formData.role === 'teacher' && { teacherData })
      };

      const response = await axios.post('/auth/register', requestData);
      const { token, user } = response.data;
      
      onLogin(user, token);
      alert('Qeydiyyat uğurludur! Xoş gəldiniz!');
    } catch (error) {
      setError(error.response?.data?.message || 'Qeydiyyat xətası baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.8), rgba(79, 70, 229, 0.8)), url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      {/* Floating Elements */}
      <div className="absolute top-16 right-24 w-5 h-5 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-48 left-28 w-4 h-4 bg-purple-200/40 rounded-full animate-bounce"></div>
      <div className="absolute bottom-24 right-20 w-6 h-6 bg-blue-200/35 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 left-24 w-3 h-3 bg-white/25 rounded-full animate-bounce"></div>
      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-cyan-200/40 rounded-full animate-pulse"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="bg-white/20 backdrop-blur-sm text-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30">
            <i className="fas fa-user-plus text-4xl"></i>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">
            Hesab Yaradın
          </h2>
          <p className="text-xl text-white/90">
            DərsTap ailəsinə qoşulun və təhsilin gələcəyini dəyişin
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/50">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 animate-shake">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Rol Seçin
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'student', label: 'Tələbə', icon: 'graduation-cap', color: 'green' },
                  { value: 'teacher', label: 'Müəllim', icon: 'chalkboard-teacher', color: 'blue' },
                  { value: 'parent', label: 'Valideyn', icon: 'users', color: 'purple' }
                ].map((role) => (
                  <label
                    key={role.value}
                    className={`group flex flex-col items-center p-6 border-3 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      formData.role === role.value
                        ? `border-${role.color}-500 bg-${role.color}-50 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <i className={`fas fa-${role.icon} text-4xl mb-3 ${
                      formData.role === role.value ? `text-${role.color}-600` : 'text-gray-400'
                    } group-hover:animate-bounce`}></i>
                    <span className={`font-semibold text-lg ${
                      formData.role === role.value ? `text-${role.color}-600` : 'text-gray-700'
                    }`}>
                      {role.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-user mr-2 text-blue-600"></i>
                  Ad
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Adınız"
                />
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-user mr-2 text-blue-600"></i>
                  Soyad
                </label>
                <input
                  type="text"
                  name="surname"
                  id="surname"
                  required
                  value={formData.surname}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Soyadınız"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fas fa-envelope mr-2 text-blue-600"></i>
                Email Ünvanı
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="email@nümunə.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-lock mr-2 text-blue-600"></i>
                  Şifrə
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ən azı 6 simvol"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-lock mr-2 text-blue-600"></i>
                  Şifrəni Təsdiq Et
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Şifrəni təkrarlayın"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-phone mr-2 text-blue-600"></i>
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+994XXXXXXXXX"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                  Şəhər
                </label>
                <select
                  name="city"
                  id="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Şəhər seçin</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teacher Specific Fields */}
            {formData.role === 'teacher' && (
              <div className="border-t-4 border-gradient-to-r from-blue-500 to-purple-500 pt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  <i className="fas fa-chalkboard-teacher mr-3 text-blue-600"></i>
                  Müəllim Məlumatları
                </h3>

                <div className="space-y-6">
                  {/* Fənn Seçimi - Yeni Dizayn */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <i className="fas fa-book mr-2 text-blue-600"></i>
                      Fənnlər (seçdikləriniz)
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl p-4 max-h-40 overflow-y-auto bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {subjects.map((subject) => (
                          <label
                            key={subject}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                              teacherData.subjects.includes(subject)
                                ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                                : 'bg-white border border-gray-300 hover:border-blue-300 text-gray-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={teacherData.subjects.includes(subject)}
                              onChange={() => handleSubjectToggle(subject)}
                              className="sr-only"
                            />
                            <span className="text-sm font-medium">{subject}</span>
                            {teacherData.subjects.includes(subject) && (
                              <i className="fas fa-check ml-auto text-blue-600"></i>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                    {teacherData.subjects.length > 0 && (
                      <div className="mt-2 text-sm text-blue-600">
                        Seçilmiş: {teacherData.subjects.length} fənn
                      </div>
                    )}
                  </div>

                  {/* Tədris Növü */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <i className="fas fa-laptop mr-2 text-blue-600"></i>
                      Tədris Növü
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        teacherData.teachingMode.includes('online')
                          ? 'bg-green-50 border-green-500 text-green-800'
                          : 'bg-white border-gray-300 hover:border-green-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={teacherData.teachingMode.includes('online')}
                          onChange={() => handleTeachingModeToggle('online')}
                          className="sr-only"
                        />
                        <i className="fas fa-video text-2xl mr-3"></i>
                        <div>
                          <div className="font-semibold">Online Dərslər</div>
                          <div className="text-sm opacity-75">Video zəng ilə</div>
                        </div>
                        {teacherData.teachingMode.includes('online') && (
                          <i className="fas fa-check ml-auto"></i>
                        )}
                      </label>

                      <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        teacherData.teachingMode.includes('offline')
                          ? 'bg-blue-50 border-blue-500 text-blue-800'
                          : 'bg-white border-gray-300 hover:border-blue-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={teacherData.teachingMode.includes('offline')}
                          onChange={() => handleTeachingModeToggle('offline')}
                          className="sr-only"
                        />
                        <i className="fas fa-chalkboard-teacher text-2xl mr-3"></i>
                        <div>
                          <div className="font-semibold">Offline Dərslər</div>
                          <div className="text-sm opacity-75">Üz-üzə dərslər</div>
                        </div>
                        {teacherData.teachingMode.includes('offline') && (
                          <i className="fas fa-check ml-auto"></i>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Qiymətlər */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teacherData.teachingMode.includes('online') && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <i className="fas fa-video mr-2 text-green-600"></i>
                          Online Dərs Qiyməti (₼/saat)
                        </label>
                        <input
                          type="number"
                          name="onlineRate"
                          value={teacherData.onlineRate}
                          onChange={handleTeacherDataChange}
                          className="input-field"
                          placeholder="20"
                          min="1"
                          required={teacherData.teachingMode.includes('online')}
                        />
                      </div>
                    )}

                    {teacherData.teachingMode.includes('offline') && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <i className="fas fa-chalkboard-teacher mr-2 text-blue-600"></i>
                          Offline Dərs Qiyməti (₼/saat)
                        </label>
                        <input
                          type="number"
                          name="offlineRate"
                          value={teacherData.offlineRate}
                          onChange={handleTeacherDataChange}
                          className="input-field"
                          placeholder="30"
                          min="1"
                          required={teacherData.teachingMode.includes('offline')}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <i className="fas fa-clock mr-2 text-blue-600"></i>
                        Təcrübə (il)
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={teacherData.experience}
                        onChange={handleTeacherDataChange}
                        className="input-field"
                        placeholder="5"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <i className="fas fa-layer-group mr-2 text-blue-600"></i>
                        Sinif/Səviyyə
                      </label>
                      <select
                        name="grade"
                        value={teacherData.grade}
                        onChange={handleTeacherDataChange}
                        className="input-field"
                        required
                      >
                        <option value="">Səviyyə seçin</option>
                        {grades.map((grade) => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <i className="fas fa-university mr-2 text-blue-600"></i>
                      Təhsil
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={teacherData.education}
                      onChange={handleTeacherDataChange}
                      className="input-field"
                      placeholder="Bakı Dövlət Universiteti, Riyaziyyat fakültəsi"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <i className="fas fa-user-edit mr-2 text-blue-600"></i>
                      Haqqınızda (İstəyə bağlı)
                    </label>
                    <textarea
                      name="bio"
                      value={teacherData.bio}
                      onChange={handleTeacherDataChange}
                      rows="4"
                      className="input-field resize-none"
                      placeholder="Özünüz və tədris metodunuz haqqında qısa məlumat..."
                      maxLength="500"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                      {teacherData.bio.length}/500 simvol
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-center justify-center">
              <label className="flex items-center text-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                />
                <span className="text-sm text-gray-700">
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                    İstifadə şərtləri
                  </Link>
                  ni və{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                    məxfilik siyasətini
                  </Link>
                  ni qəbul edirəm
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-xl py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-3"></i>
                    Qeydiyyat edilir...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-3"></i>
                    Qeydiyyatdan Keç
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Artıq hesabınız var?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
                  Giriş edin
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;