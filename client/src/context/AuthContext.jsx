import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

//const API_BASE = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'https://celesticare-api.onrender.com/api').replace(/\/$/, '');

// 1. If VITE_API_BASE_URL is set (in .env or .env.local), use it.
// 2. In production on Vercel, use same-origin '/api' (proxied via vercel.json to Render).
// 3. Otherwise, fallback directly to the live Render backend.

const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }
  return import.meta.env.PROD 
    ? '/api' 
    : 'https://celesticare-api.onrender.com/api';
};
*/

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const fetchUserProfile = useCallback(async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('[AuthContext] Failed to fetch user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { 
          success: false, 
          error: data.error || data.message || 'Invalid email or password.' 
        };
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('[AuthContext] Login connection error:', err);
      return { 
        success: false, 
        error: 'Unable to connect to server. If the server was sleeping, please wait 30 seconds and try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(userData)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { 
          success: false, 
          error: data.error || data.message || (data.errors && data.errors[0]?.msg) || 'Registration failed.' 
        };
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('[AuthContext] Registration connection error:', err);
      return { 
        success: false, 
        error: 'Unable to connect to server. If the server was sleeping, please wait 30 seconds and try again.' 
      };
    }
  };

  const updateUserProfile = async (updates) => {
    const activeToken = token || localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setUser(data.user);
        return { success: true, message: data.message || 'Profile updated successfully!' };
      }
      return { success: false, message: data.message || data.error || 'Failed to update profile.' };
    } catch (err) {
      console.error('[AuthContext] Update profile error:', err);
      return { success: false, message: err.message || 'Network error updating profile.' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      fetchUserProfile,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);