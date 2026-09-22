import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => {
    const token = localStorage.getItem('celesticare_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  const checkSession = async () => {
    const token = localStorage.getItem('celesticare_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/me', { headers: getHeaders() });
      if (!response.ok) {
        setUser(null);
        localStorage.removeItem('celesticare_token');
        return;
      }
      const data = await response.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        if (data.user.zodiac_sign) sessionStorage.setItem('zodiac_sign', data.user.zodiac_sign);
        if (data.user.undertone) sessionStorage.setItem('undertone', data.user.undertone);
        if (data.user.season) sessionStorage.setItem('season', data.user.season);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', { headers: getHeaders() });
      if (!res.ok) {
        if (res.status === 401) setUser(null);
        return null;
      }
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      }
    } catch {
      setUser(null);
    }
    return null;
  };

  const createProfile = async (profileData) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateUserProfile = async (formData) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setUser(null);
        localStorage.removeItem('celesticare_token');
        sessionStorage.clear();
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const loginUser = async (userDataOrEmail, password) => {
    if (userDataOrEmail && typeof userDataOrEmail === 'object') {
      setUser(userDataOrEmail);
      return { success: true, user: userDataOrEmail };
    }

    const email = userDataOrEmail;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) localStorage.setItem('celesticare_token', data.token);
        setUser(data.user);
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders()
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('celesticare_token');
      sessionStorage.clear();
    }
  };

  const updateUserProfileData = (fields) => {
    setUser(prev => (prev ? { ...prev, ...fields } : fields));
    Object.entries(fields).forEach(([k, v]) => {
      if (v) sessionStorage.setItem(k, v);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        fetchUserProfile,
        createProfile,
        updateUserProfile,
        deleteUserProfile,
        loginUser,
        logoutUser,
        updateUserProfileData,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}