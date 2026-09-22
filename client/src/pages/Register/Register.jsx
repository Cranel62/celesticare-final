import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../Login/Login.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    admin_secret: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdminDomain = formData.email.trim().toLowerCase().endsWith('@celesticare.admin.com');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(result.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.brandTitle}>CELESTICARE</div>
        <div className={styles.subTitle}>Create your cosmic profile</div>

        {errorMessage && (
          <div className="alert alert-danger" style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px 15px', 
            borderRadius: '10px', 
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={styles.inputField}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.inputField}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.inputField}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              className={styles.inputField}
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          {isAdminDomain && (
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="admin_secret"
                placeholder="Admin Secret Key"
                className={styles.inputField}
                value={formData.admin_secret}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.footerText}>
          Already have a profile? <Link to="/login" className={styles.linkText}>Log in</Link>
        </div>
      </div>
    </div>
  );
}