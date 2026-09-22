import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

const ADMIN_EMAIL_DOMAIN = '@celesticare.admin.com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Both fields are required.');
      return;
    }

    setIsLoading(true);
    const res = await loginUser(trimmedEmail, password);
    setIsLoading(false);

    if (res.success) {
      const isAdmin = trimmedEmail.toLowerCase().includes(ADMIN_EMAIL_DOMAIN);
      navigate(isAdmin ? '/admin' : '/');
    } else {
      setErrorMessage(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginBox}>
        <button className={styles.closeBtn} onClick={() => navigate('/')}>
          <i className="fas fa-times"></i>
        </button>
        <div className={styles.brandTitle}>CELESTICARE</div>
        <h2 className={styles.loginHeading}>Log in to your profile</h2>

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
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.formControl}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? 'far fa-eye-slash' : 'far fa-eye'}></i>
            </button>
          </div>
          <button type="submit" className={styles.btnLogin} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <p className={styles.textMuted}>
            Don't have a profile? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}