import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminUsers.module.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://celesticare-api.onrender.com/api';

export default function AdminUserDetail() {
  const { id } = useParams();
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  const [targetUser, setTargetUser] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });

  const showToast = (text, type = 'success') => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: '', type: 'success' }), 4000);
  };

  const loadUserData = useCallback(async () => {
    try {
      const activeToken = token || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user/admin/user/${id}`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTargetUser(data.user);
      } else {
        showToast(data.message || 'User not found', 'danger');
        navigate('/admin/users');
      }
    } catch (err) {
      showToast('Error loading profile', 'danger');
    } finally {
      setFetching(false);
    }
  }, [id, token, navigate]);

  useEffect(() => {
    if (!loading) {
      if (!user || (!user.is_admin && user.role !== 'admin')) {
        navigate('/dashboard');
        return;
      }
      loadUserData();
    }
  }, [user, loading, loadUserData, navigate]);

  const handleResetPassword = async () => {
    try {
      const activeToken = token || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user/admin/reset-password/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${activeToken}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        setShowModal(false);
      } else {
        showToast(data.message || 'Reset failed', 'danger');
      }
    } catch (err) {
      showToast('Network error resetting password', 'danger');
    }
  };

  if (loading || fetching) {
    return <div className={styles.adminContainer} style={{ textAlign: 'center', paddingTop: '150px' }}>Loading profile...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.bgAccentOne}></div>
      <div className={styles.bgAccentTwo}></div>

      <div className={styles.innerWrap}>
        {toast.show && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '14px 24px',
            borderRadius: '12px',
            background: toast.type === 'success' ? '#28a745' : '#dc3545',
            color: 'white'
          }}>
            {toast.text}
          </div>
        )}

        <div className={styles.adminHeader}>
          <div>
            <h1 className={styles.brandTitle}><i className="fas fa-user-circle me-2"></i> USER PROFILE</h1>
            <p style={{ margin: 0, opacity: 0.85 }}>Viewing user: <strong>{targetUser?.username}</strong></p>
          </div>
          <div>
            <button 
              className={styles.filterBtn}
              onClick={() => navigate('/admin/users')}
            >
              <i className="fas fa-arrow-left me-1"></i> Back to Users
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
          {/* Main info */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(232, 228, 242, 0.95) 0%, rgba(198, 185, 232, 0.95) 100%)',
            padding: '30px',
            borderRadius: '20px',
            color: '#2e2e2e'
          }}>
            <h3 style={{ borderBottom: '2px solid #4b3f77', paddingBottom: '12px', marginBottom: '20px', color: '#4b3f77' }}>
              Account Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <small style={{ color: '#4b3f77', fontWeight: 'bold' }}>USERNAME</small>
                <div style={{ background: '#fff', padding: '12px', borderRadius: '10px', marginTop: '6px' }}>
                  {targetUser?.username}
                </div>
              </div>
              <div>
                <small style={{ color: '#4b3f77', fontWeight: 'bold' }}>EMAIL ADDRESS</small>
                <div style={{ background: '#fff', padding: '12px', borderRadius: '10px', marginTop: '6px' }}>
                  {targetUser?.email}
                </div>
              </div>
            </div>

            <button 
              className={`${styles.btnAction} ${styles.btnView}`}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '20px', fontSize: '1rem', fontWeight: '600' }}
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-key me-2"></i> Reset User Password to CelestiCare123!
            </button>
          </div>

          {/* Quick stats */}
          <div>
            <div style={{ background: '#fff', color: '#2e2e2e', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              <h5 style={{ color: '#4b3f77', fontWeight: '600', marginBottom: '15px' }}>Account Status</h5>
              <p><strong>User ID:</strong> <small>{targetUser?._id}</small></p>
              <p><strong>Registered:</strong> {new Date(targetUser?.created_at).toLocaleDateString()}</p>
              <p><strong>Role:</strong> <span className={`${styles.badge} ${styles.badgeSecondary}`}>{targetUser?.role}</span></p>
            </div>

            <div style={{ background: '#fff', color: '#2e2e2e', padding: '20px', borderRadius: '15px' }}>
              <h5 style={{ color: '#4b3f77', fontWeight: '600', marginBottom: '15px' }}>Quiz Results</h5>
              <p><strong>Zodiac Sign:</strong> {targetUser?.zodiac_sign || 'Not Set'}</p>
              <p><strong>Aesthetic:</strong> {targetUser?.aesthetic_result || 'Not Completed'}</p>
              <p><strong>Style:</strong> {targetUser?.style_result || 'Not Completed'}</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Reset Password</h3>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to reset the password for <strong>{targetUser?.username}</strong>?</p>
              <div style={{ background: '#e8f5e9', border: '2px dashed #28a745', padding: '15px', borderRadius: '10px', textAlign: 'center', margin: '15px 0' }}>
                <small>New default password:</small>
                <h3 style={{ margin: '8px 0', color: '#28a745' }}>CelestiCare123!</h3>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#aaa', color: '#fff', cursor: 'pointer' }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#28a745', color: '#fff', cursor: 'pointer' }}
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}