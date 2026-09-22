import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const ADMIN_EMAIL_DOMAIN = '@celesticare.admin.com';
const ADMIN_SECRET_KEY = 'CelestiCare2025!';

const API_BASE = 'http://localhost:5000/api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isAdminEmail = email.toLowerCase().includes(ADMIN_EMAIL_DOMAIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }
    if (isAdminEmail && password !== ADMIN_SECRET_KEY) {
      setErrorMessage('Invalid admin password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        navigate('/login?registered=1');
      } else {
        setErrorMessage(data.error || data.message || 'Registration failed.');
      }
    } catch {
      setErrorMessage('Server connection error. Ensure the backend server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginBox}>
        <button className={styles.closeBtn} onClick={() => navigate('/')}>
          <i className="fas fa-times"></i>
        </button>
        <div className={styles.brandTitle}>CELESTICARE</div>
        <h2 className={styles.loginHeading}>Create your profile</h2>

        {errorMessage && <div className={styles.alertDanger}>{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.formControl}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className={styles.formControl}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className={styles.formControl}
            placeholder={isAdminEmail ? 'Admin Key (CelestiCare2025!)' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className={styles.formControl}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.btnLogin} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
          <p className={styles.textMuted}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}