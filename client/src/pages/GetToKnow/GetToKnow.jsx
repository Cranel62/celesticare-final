import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './GetToKnow.module.css';

export const calculateZodiacSign = (birthdate) => {
  if (!birthdate) return '';
  const date = new Date(birthdate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  return '';
};

export default function GetToKnow() {
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '', birthdate: '', gender: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const zodiac_sign = calculateZodiacSign(formData.birthdate);
    await updateUserProfile({ ...formData, zodiac_sign });
    navigate('/dashboard');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.setupContainer}>
        <div className={styles.setupBox}>
          <div className={styles.brandTitle}>CELESTICARE</div>
          <h2>Time to get to know you</h2>
          <p>Provide the following details below</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              className={styles.formControl}
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="date"
              name="birthdate"
              className={styles.formControl}
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              required
            />
            <select
              name="gender"
              className={styles.formControl}
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              required
            >
              <option value="">Select Gender</option>
              <option value="Masculine">Masculine</option>
              <option value="Feminine">Feminine</option>
            </select>
            <button type="submit" className={styles.btnContinue}>Continue to Dashboard</button>
          </form>
        </div>
      </div>
    </div>
  );
}