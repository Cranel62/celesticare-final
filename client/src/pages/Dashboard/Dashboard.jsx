import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

import warmWheelImg from '../../assets/images/warm_wheel.png';
import coolWheelImg from '../../assets/images/cool_wheel.png';
import neutralWheelImg from '../../assets/images/neutral_wheel.png';
import dashboardArtwork from '../../assets/images/dashboard.png';
import vectorArtwork from '../../assets/images/vector.png';
import zodiacCircleArtwork from '../../assets/images/zodiac_circle.png';
import fireBg from '../../assets/images/fire_bg.jpeg';
import airBg from '../../assets/images/air_bg.jpeg';
import waterBg from '../../assets/images/water_bg.jpeg';
import warmSkin from '../../assets/images/warm_skin.png';

const API_BASE = 'http://localhost:5000';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

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

const AESTHETICS = {
  academia: { title: "The Scholar", color: "#271a0e", side1: dashboardArtwork },
  boho: { title: "The Bohemian Dreamer", color: "#e38153", side1: vectorArtwork },
  coquette: { title: "The Coquette Muse", color: "#f5c4d4", side1: zodiacCircleArtwork },
  grunge: { title: "The Rebel Soul", color: "#a1a1a1", side1: warmSkin },
  punk: { title: "The Anarchic Icon", color: "#ff0000", side1: fireBg },
  y2k: { title: "The Futuristic Popstar", color: "#d46be3", side1: airBg },
  luxurious: { title: "The Luxe Visionary", color: "#c93939", side1: waterBg }
};

const STYLES = {
  minimalist: { name: 'Minimalist Elegance', color: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', textColor: '#374151' },
  businesswear: { name: 'Professional Businesswear', color: 'linear-gradient(135deg, #1e3a8a, #3730a3)', textColor: '#ffffff' },
  elegant: { name: 'Classic Elegance', color: 'linear-gradient(135deg, #7e22ce, #c084fc)', textColor: '#ffffff' },
  creative: { name: 'Creative Expression', color: 'linear-gradient(135deg, #ea580c, #f59e0b)', textColor: '#ffffff' },
  soft: { name: 'Soft Elegance', color: 'linear-gradient(135deg, #f9a8d4, #f472b6)', textColor: '#ffffff' },
  rough: { name: 'Rough Edge', color: 'linear-gradient(135deg, #4b5563, #6b7280)', textColor: '#ffffff' },
  streetwear: { name: 'Urban Streetwear', color: 'linear-gradient(135deg, #000000, #374151)', textColor: '#ffffff' }
};

const COLOR_PALETTES = {
  Warm: ["#E69A5B", "#F5C16C", "#D76A03", "#C25B02", "#FFD27F"],
  Cool: ["#5B7BE6", "#A3C1F7", "#7089E3", "#4059C2", "#9EB8FF"],
  Neutral: ["#D7BFAE", "#C1B3A4", "#A8988B", "#8B7C6F", "#BFA98B"]
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, fetchUserProfile, updateUserProfile, deleteUserProfile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ text: '', type: '' });
  const [editForm, setEditForm] = useState({ name: '', gender: '', birthdate: '', zodiac_sign: '' });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
    if (user) {
      setEditForm({
        name: user.name || '',
        gender: user.gender || '',
        birthdate: user.birthdate || '',
        zodiac_sign: user.zodiac_sign || ''
      });
    }
  }, [loading, isAuthenticated]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await updateUserProfile(editForm);
    if (res.success) {
      setAlertInfo({ text: 'Profile updated successfully!', type: 'success' });
      setShowEditModal(false);
    } else {
      setAlertInfo({ text: res.error || 'Failed to update', type: 'error' });
    }
  };

  if (loading || !user) return null;

  const currentZodiac = user.zodiac_sign || 'Aries';
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
                onChange={(e) => setEditForm({ ...editForm, birthdate: e.target.value })}
              />
              <button type="submit" className={styles.btnSave}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}