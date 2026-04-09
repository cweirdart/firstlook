import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Admin Dashboard — view waitlist signups and basic stats.
 *
 * Protected by a simple password (VITE_ADMIN_PASSWORD) since we don't
 * need full admin auth infrastructure for a pre-launch product.
 * Upgrade to proper role-based auth when the app goes live.
 */

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'firstlook2026';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError('');
      sessionStorage.setItem('admin-auth', 'true');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('admin-auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchWaitlist();
  }, [authenticated]);

  const fetchWaitlist = async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        // Fallback to localStorage
        const local = JSON.parse(localStorage.getItem('waitlist') || '[]');
        setWaitlist(local.map((email, i) => ({ id: i, email, created_at: null })));
        setStats({ total: local.length, today: 0, thisWeek: 0 });
        return;
      }

      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWaitlist(data || []);

      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const todayCount = (data || []).filter(
        (item) => new Date(item.created_at) >= today
      ).length;
      const weekCount = (data || []).filter(
        (item) => new Date(item.created_at) >= weekAgo
      ).length;

      setStats({
        total: (data || []).length,
        today: todayCount,
        thisWeek: weekCount,
      });
    } catch (err) {
      console.error('Failed to fetch waitlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csv = [
      'email,signed_up,source',
      ...waitlist.map(
        (item) =>
          `${item.email},${item.created_at || ''},${item.source || 'waitlist'}`
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firstlook-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="admin-page">
        <style>{adminStyles}</style>
        <div className="admin-login-card">
          <h1 className="admin-title">Admin Access</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="admin-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="admin-btn">Enter</button>
            {passwordError && <p className="admin-error">{passwordError}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <style>{adminStyles}</style>

      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">First Look Admin</h1>
            <p className="admin-subtitle">Waitlist & Pre-launch Dashboard</p>
          </div>
          <div className="admin-actions">
            <button className="admin-btn-secondary" onClick={fetchWaitlist} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="admin-btn-secondary" onClick={exportCSV} disabled={waitlist.length === 0}>
              Export CSV
            </button>
            <button
              className="admin-btn-secondary"
              onClick={() => {
                sessionStorage.removeItem('admin-auth');
                setAuthenticated(false);
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Signups</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.today}</div>
            <div className="stat-label">Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.thisWeek}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>

        {/* Waitlist table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Source</th>
                <th>Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9C8F87' }}>
                    {loading ? 'Loading...' : 'No signups yet. Share your waitlist link!'}
                  </td>
                </tr>
              ) : (
                waitlist.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td>{item.email}</td>
                    <td>{item.source || 'waitlist'}</td>
                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const adminStyles = `
  .admin-page {
    --bg-primary: #FBF9F6;
    --bg-secondary: #F3EDE4;
    --accent: #B8976A;
    --accent-dark: #96784F;
    --text-primary: #3D3530;
    --text-secondary: #6B5E56;
    --text-muted: #9C8F87;
    --border: #E8DFD5;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

    min-height: 100vh;
    background: var(--bg-primary);
    font-family: var(--font-body);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .admin-login-card {
    background: white;
    padding: 48px 40px;
    border-radius: 12px;
    border: 1px solid var(--border);
    max-width: 380px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 24px rgba(61, 53, 48, 0.06);
  }

  .admin-container {
    max-width: 900px;
    width: 100%;
    align-self: flex-start;
    margin: 0 auto;
    padding-top: 40px;
  }

  .admin-title {
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 400;
    margin-bottom: 8px;
  }

  .admin-subtitle {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 0;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .admin-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  .admin-input {
    width: 100%;
    padding: 14px 16px;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 0.95rem;
    margin-bottom: 12px;
    text-align: center;
  }

  .admin-input:focus { outline: none; border-color: var(--accent); }

  .admin-btn {
    padding: 12px 24px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s ease;
  }

  .admin-btn:hover { background: var(--accent-dark); }

  .admin-btn-secondary {
    padding: 10px 18px;
    background: white;
    color: var(--text-secondary);
    border: 1.5px solid var(--border);
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .admin-btn-secondary:hover { border-color: var(--accent); color: var(--accent-dark); }
  .admin-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

  .admin-error { color: #c0392b; font-size: 0.85rem; margin-top: 12px; }

  .admin-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    padding: 24px;
    border-radius: 10px;
    border: 1px solid var(--border);
    text-align: center;
  }

  .stat-number {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 500;
    color: var(--accent-dark);
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-label { color: var(--text-muted); font-size: 0.85rem; }

  .admin-table-wrapper {
    background: white;
    border-radius: 10px;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .admin-table th {
    background: var(--bg-secondary);
    padding: 12px 16px;
    text-align: left;
    font-weight: 500;
    color: var(--text-secondary);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .admin-table td {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
    color: var(--text-primary);
  }

  .admin-table tbody tr:hover { background: var(--bg-primary); }

  @media (max-width: 640px) {
    .admin-stats { grid-template-columns: 1fr; }
    .admin-header { flex-direction: column; }
  }
`;

export default Admin;
