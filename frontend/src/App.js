import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchResults from './pages/SearchResults';
import TeacherProfile from './pages/TeacherProfile';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Token varsa istifadəçi məlumatlarını al
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('İstifadəçi məlumatları alınmadı:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />
              } 
            />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/teacher/:id" element={<TeacherProfile user={user} />} />
            <Route 
              path="/dashboard" 
              element={
                user ? <StudentDashboard user={user} /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' ? 
                <AdminPanel user={user} /> : 
                <Navigate to="/" />
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;