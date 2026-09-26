import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../api/axios';
import styles from './AdminUsers.module.css';

export default function AdminUsers() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, archivedUsers: 0, adminUsers: 0 });
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('active');
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });
  const [modal, setModal] = useState({ open: false, type: '', targetUser: null });

  const showToast = (text, type = 'success') => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: '', type: 'success' }), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      const activeToken = token || localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${activeToken}` };

      const [resStats, resUsers] = await Promise.all([
        fetch(`${API_BASE}/user/admin/stats`, { headers }),
        fetch(`${API_BASE}/user/admin/list?filter=${filter}`, { headers })
      ]);

      const dataStats = await resStats.json();
      const dataUsers = await resUsers.json();

      if (resStats.ok) setStats(dataStats.stats);
      if (resUsers.ok) setUsers(dataUsers.users || []);
    } catch (err) {
      showToast('Error connecting to admin API', 'danger');
    } finally {
      setFetching(false);
    }
  }, [token, filter]);

  useEffect(() => {
    if (!loading) {
      if (!user || (!user.is_admin && user.role !== 'admin')) {
        navigate('/dashboard');
        return;
      }
      loadData();
    }
  }, [user, loading, filter, loadData, navigate]);

  const handleAction = async () => {
    const { type, targetUser } = modal;
    if (!targetUser) return;
    const activeToken = token || localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${activeToken}`, 'Content-Type': 'application/json' };

    try {
      let res;
      if (type === 'archive') {
        res = await fetch(`${API_BASE}/user/admin/archive/${targetUser._id}`, { method: 'POST', headers });
      } else if (type === 'restore') {
        res = await fetch(`${API_BASE}/user/admin/restore/${targetUser._id}`, { method: 'POST', headers });
      } else if (type === 'delete') {
        res = await fetch(`${API_BASE}/user/admin/permanent/${targetUser._id}`, { method: 'DELETE', headers });
      } else if (type === 'reset') {
        res = await fetch(`${API_BASE}/user/admin/reset-password/${targetUser._id}`, { method: 'POST', headers });
      }

      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        loadData();
      } else {
        showToast(data.message || 'Operation failed', 'danger');
      }
    } catch (err) {
      showToast('Network error processing action', 'danger');
    } finally {
      setModal({ open: false, type: '', targetUser: null });
    }
  };

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
            color: 'white',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
            {toast.text}
          </div>
        )}

        <div className={styles.adminHeader}>
          <div>
            <h1 className={styles.brandTitle}><i className="fas fa-users-cog me-2"></i> CELESTICARE ADMIN</h1>
            <p style={{ margin: 0, opacity: 0.85 }}>User Management Panel</p>
          </div>
          <div>
            <span>Welcome, <strong>{user?.email}</strong></span>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statTotal}`}>
            <div>
              <h2 style={{ margin: 0 }}>{stats.totalUsers}</h2>
              <small>Total Users</small>
            </div>
            <i className="fas fa-users fa-2x" style={{ opacity: 0.7 }}></i>
          </div>
          <div className={`${styles.statCard} ${styles.statActive}`}>
            <div>
              <h2 style={{ margin: 0 }}>{stats.activeUsers}</h2>
              <small>Active Users</small>
            </div>
            <i className="fas fa-user-check fa-2x" style={{ opacity: 0.7 }}></i>
          </div>
          <div className={`${styles.statCard} ${styles.statArchived}`}>
            <div>
              <h2 style={{ margin: 0 }}>{stats.archivedUsers}</h2>
              <small>Archived Users</small>
            </div>
            <i className="fas fa-archive fa-2x" style={{ opacity: 0.7 }}></i>
          </div>
          <div className={`${styles.statCard} ${styles.statAdmin}`}>
            <div>
              <h2 style={{ margin: 0 }}>{stats.adminUsers}</h2>
              <small>Admin Accounts</small>
            </div>
            <i className="fas fa-user-shield fa-2x" style={{ opacity: 0.7 }}></i>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterBtn} ${filter === 'active' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('active')}
          >
            <i className="fas fa-user-check me-2"></i> Active Users ({stats.activeUsers})
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'archived' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('archived')}
          >
            <i className="fas fa-archive me-2"></i> Archived Users ({stats.archivedUsers})
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('all')}
          >
            <i className="fas fa-users me-2"></i> All Users
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>User Type</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const isArchived = Boolean(u.deleted_at);
                const isCurrentAdmin = u._id === user?._id;
                return (
                  <tr key={u._id} className={isArchived ? styles.archivedRow : ''}>
                    <td><strong>#{i + 1}</strong></td>
                    <td>
                      <strong>{u.username}</strong>
                      {isCurrentAdmin && <span className={`${styles.badge} ${styles.badgeSuccess}`} style={{ marginLeft: 6 }}>You</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {isArchived ? (
                        <span className={`${styles.badge} ${styles.badgeDanger}`}>Archived</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>
                      )}
                    </td>
                    <td>
                      {u.is_admin || u.role === 'admin' ? (
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>Admin</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeSecondary}`}>Regular</span>
                      )}
                    </td>
                    <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {isArchived ? (
                        <>
                          <button 
                            className={`${styles.btnAction} ${styles.btnRestore}`} 
                            onClick={() => setModal({ open: true, type: 'restore', targetUser: u })}
                          >
                            <i className="fas fa-undo-alt me-1"></i> Restore
                          </button>
                          <button 
                            className={`${styles.btnAction} ${styles.btnDelete}`} 
                            onClick={() => setModal({ open: true, type: 'delete', targetUser: u })}
                          >
                            <i className="fas fa-trash-alt me-1"></i> Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className={`${styles.btnAction} ${styles.btnView}`} 
                            onClick={() => navigate(`/admin/user/${u._id}`)}
                          >
                            <i className="fas fa-edit me-1"></i> View
                          </button>
                          <button 
                            className={`${styles.btnAction} ${styles.btnReset}`} 
                            onClick={() => setModal({ open: true, type: 'reset', targetUser: u })}
                          >
                            <i className="fas fa-key me-1"></i> Reset
                          </button>
                          {!u.is_admin && u.role !== 'admin' && (
                            <button 
                              className={`${styles.btnAction} ${styles.btnArchive}`} 
                              onClick={() => setModal({ open: true, type: 'archive', targetUser: u })}
                            >
                              <i className="fas fa-archive me-1"></i> Archive
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && !fetching && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No users found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Confirm {modal.type.toUpperCase()}</h3>
            </div>
            <div className={styles.modalBody}>
              {modal.type === 'archive' && (
                <p>Are you sure you want to archive <strong>{modal.targetUser?.username}</strong>? They will be unable to log in until restored.</p>
              )}
              {modal.type === 'restore' && (
                <p>Restore <strong>{modal.targetUser?.username}</strong>? Their account will be reactivated.</p>
              )}
              {modal.type === 'delete' && (
                <p style={{ color: '#dc3545' }}><strong>Warning:</strong> Permanently delete <strong>{modal.targetUser?.username}</strong>? This action cannot be undone.</p>
              )}
              {modal.type === 'reset' && (
                <div>
                  <p>Reset password for <strong>{modal.targetUser?.username}</strong> to default?</p>
                  <div style={{ background: '#e8f5e9', border: '2px dashed #28a745', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <strong>Default Password:</strong> <code>CelestiCare123!</code>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button 
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#aaa', color: '#fff', cursor: 'pointer' }}
                onClick={() => setModal({ open: false, type: '', targetUser: null })}
              >
                Cancel
              </button>
              <button 
                style={{ 
                  padding: '8px 18px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: modal.type === 'delete' || modal.type === 'archive' ? '#dc3545' : '#28a745', 
                  color: '#fff', 
                  cursor: 'pointer' 
                }}
                onClick={handleAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}