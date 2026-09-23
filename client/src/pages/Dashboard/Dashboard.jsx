import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

const ZODIAC_DETAILS = {
  Aries: { personality: "Energetic, bold, confident, and adventurous.", element: "Fire", planet: "Mars", lucky_numbers: "1, 9, 14", strengths: "Courageous, passionate, determined", weaknesses: "Impulsive, impatient, short-tempered", traits: "Action and leadership.", compatibility: "Leo and Sagittarius." },
  Taurus: { personality: "Patient, reliable, practical, and loving.", element: "Earth", planet: "Venus", lucky_numbers: "2, 6, 9", strengths: "Loyal, persistent, trustworthy", weaknesses: "Stubborn, possessive", traits: "Comfort and stability.", compatibility: "Virgo and Capricorn." },
  Gemini: { personality: "Curious, adaptable, witty, and sociable.", element: "Air", planet: "Mercury", lucky_numbers: "3, 5, 7", strengths: "Intelligent, expressive, versatile", weaknesses: "Inconsistent, indecisive", traits: "Thrives on communication.", compatibility: "Libra and Aquarius." },
  Cancer: { personality: "Emotional, caring, protective, and intuitive.", element: "Water", planet: "Moon", lucky_numbers: "2, 7, 11", strengths: "Loyal, empathetic, nurturing", weaknesses: "Moody, sensitive", traits: "Values home and emotional security.", compatibility: "Scorpio and Pisces." },
  Leo: { personality: "Confident, charismatic, generous, and creative.", element: "Fire", planet: "Sun", lucky_numbers: "1, 3, 10", strengths: "Ambitious, warm-hearted, loyal", weaknesses: "Arrogant, stubborn", traits: "Loves to shine and inspire.", compatibility: "Aries and Sagittarius." },
  Virgo: { personality: "Practical, analytical, reliable, and modest.", element: "Earth", planet: "Mercury", lucky_numbers: "5, 14, 23", strengths: "Detail-oriented, hardworking", weaknesses: "Overcritical, perfectionist", traits: "Focused on improvement.", compatibility: "Taurus and Capricorn." },
  Libra: { personality: "Charming, fair-minded, diplomatic, and sociable.", element: "Air", planet: "Venus", lucky_numbers: "6, 15, 24", strengths: "Cooperative, graceful, balanced", weaknesses: "Indecisive, superficial", traits: "Values harmony and beauty.", compatibility: "Gemini and Aquarius." },
  Scorpio: { personality: "Passionate, mysterious, determined, and resourceful.", element: "Water", planet: "Pluto", lucky_numbers: "8, 11, 18", strengths: "Loyal, brave, intuitive", weaknesses: "Jealous, secretive", traits: "Transformation and emotional depth.", compatibility: "Cancer and Pisces." },
  Sagittarius: { personality: "Adventurous, optimistic, honest, and free-spirited.", element: "Fire", planet: "Jupiter", lucky_numbers: "3, 9, 12", strengths: "Enthusiastic, idealistic", weaknesses: "Impulsive, blunt", traits: "Seeks knowledge and adventure.", compatibility: "Aries and Leo." },
  Capricorn: { personality: "Ambitious, disciplined, responsible, and patient.", element: "Earth", planet: "Saturn", lucky_numbers: "4, 8, 22", strengths: "Practical, hardworking", weaknesses: "Pessimistic, rigid", traits: "Strives for long-term achievements.", compatibility: "Taurus and Virgo." },
  Aquarius: { personality: "Innovative, original, independent, humanitarian.", element: "Air", planet: "Uranus", lucky_numbers: "2, 7, 11", strengths: "Innovative, idealistic", weaknesses: "Unpredictable, aloof", traits: "Progressive ideas and social change.", compatibility: "Gemini and Libra." },
  Pisces: { personality: "Compassionate, artistic, gentle, and empathetic.", element: "Water", planet: "Neptune", lucky_numbers: "3, 9, 12", strengths: "Imaginative, kind, intuitive", weaknesses: "Escapist, emotional", traits: "Creativity and spirituality.", compatibility: "Cancer and Scorpio." }
};

const calculateZodiacSign = (birthdate) => {
  if (!birthdate) return '';
  const [year, monthStr, dayStr] = birthdate.split('-');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, fetchUserProfile, updateUserProfile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ text: '', type: '' });
  const [editForm, setEditForm] = useState({ name: '', gender: '', birthdate: '', zodiac_sign: '' });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setEditForm({
        name: user.name || '',
        gender: user.gender || '',
        birthdate: user.birthdate || '',
        zodiac_sign: user.zodiac_sign || ''
      });
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleBirthdateChange = (e) => {
    const bdate = e.target.value;
    const computedZodiac = calculateZodiacSign(bdate);
    setEditForm((prev) => ({
      ...prev,
      birthdate: bdate,
      zodiac_sign: computedZodiac || prev.zodiac_sign
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const computedZodiac = calculateZodiacSign(editForm.birthdate) || editForm.zodiac_sign;
    const payload = { ...editForm, zodiac_sign: computedZodiac };

    const res = await updateUserProfile(payload);
    if (res.success) {
      setAlertInfo({ text: 'Profile updated successfully!', type: 'success' });
      await fetchUserProfile();
      setShowEditModal(false);
    } else {
      setAlertInfo({ text: res.message || res.error || 'Failed to update', type: 'error' });
    }
  };

  if (loading || !user) return null;

  const currentZodiac = user.zodiac_sign || calculateZodiacSign(user.birthdate) || 'Aries';
  const zodiacData = ZODIAC_DETAILS[currentZodiac] || ZODIAC_DETAILS.Aries;

  return (
    <div className={styles.dashboardPage}>
      {alertInfo.text && (
        <div className={`${styles.alertCustom} ${alertInfo.type === 'success' ? 'alert alert-success' : 'alert alert-danger'}`}>
          {alertInfo.text}
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.mainCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 className={styles.headerTitle}>Welcome, {user.username}!</h2>
              <p className={styles.headerSubtitle}>Your celestial styling and healthcare dashboard.</p>
            </div>
            <button className={styles.btnEditProfile} onClick={() => setShowEditModal(true)}>
              Edit Profile
            </button>
          </div>

          <div className={styles.gridContainer}>
            <div className={styles.profileSection}>
              <div className={styles.sectionTitle}>Profile Details</div>
              <div className={styles.profileInfo}>
                <div className={styles.profileItem}><span className={styles.profileLabel}>Name:</span> {user.name || 'Not set'}</div>
                <div className={styles.profileItem}><span className={styles.profileLabel}>Username:</span> {user.username}</div>
                <div className={styles.profileItem}><span className={styles.profileLabel}>Email:</span> {user.email}</div>
                <div className={styles.profileItem}><span className={styles.profileLabel}>Gender:</span> {user.gender || 'Not set'}</div>
                <div className={styles.profileItem}><span className={styles.profileLabel}>Birthdate:</span> {user.birthdate || 'Not set'}</div>
                <div className={styles.profileItem}><span className={styles.profileLabel}>Zodiac:</span> {currentZodiac}</div>
                <div className={styles.profileItem}><span className={styles.profileLabel}>Undertone:</span> {user.undertone ? user.undertone.toUpperCase() : 'Not set'}</div>
                <div className={styles.profileItem}><span className={styles.profileLabel}>Season:</span> {user.season || 'Not set'}</div>
              </div>
            </div>

            <div className={styles.astroSection}>
              <div className={styles.sectionTitle}>Astro Insights</div>
              <div className={styles.zodiacName}>{currentZodiac} ({zodiacData.element})</div>
              <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '10px' }}>{zodiacData.personality}</p>
              <div style={{ marginTop: '15px' }}>
                <Link to="/forecast" className={styles.astroGlowBtn}>VIEW FULL CHART</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Profile</h3>
              <button className={styles.closeModalBtn} onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                className={styles.formControl}
                placeholder="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <select
                className={styles.formControl}
                value={editForm.gender}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Masculine">Masculine</option>
                <option value="Feminine">Feminine</option>
              </select>
              <input
                type="date"
                className={styles.formControl}
                value={editForm.birthdate}
                onChange={handleBirthdateChange}
              />
              <button type="submit" className={styles.btnSave}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}