import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
import client from '../../api/client';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get('/admin/dashboard');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">🛡️ Admin Portal</div>
        <nav className="admin-nav">
          <button className="active"><LayoutDashboard size={18} /> Dashboard</button>
          <button><ShoppingBag size={18} /> Orders</button>
          <button><Package size={18} /> Products</button>
          <button><Users size={18} /> Customers</button>
        </nav>
      </div>

      <div className="admin-main">
        <header className="admin-header">
          <h2>Overview</h2>
          <div className="admin-user">Administrator</div>
        </header>

        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon sales"><TrendingUp size={24} /></div>
            <div className="stat-info">
              <span className="label">Total Sales</span>
              <h3 className="value">₹{stats?.totalSales.toLocaleString()}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orders"><ShoppingBag size={24} /></div>
            <div className="stat-info">
              <span className="label">Total Orders</span>
              <h3 className="value">{stats?.totalOrders}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon users"><Users size={24} /></div>
            <div className="stat-info">
              <span className="label">Total Customers</span>
              <h3 className="value">{stats?.totalUsers}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon products"><Package size={24} /></div>
            <div className="stat-info">
              <span className="label">Active Products</span>
              <h3 className="value">{stats?.totalProducts}</h3>
            </div>
          </div>
        </div>

        <div className="admin-content-grid">
          <div className="admin-panel orders-panel">
            <h3>Recent Orders</h3>
            <div className="placeholder-table">
              {/* This would be a real table in a full implementation */}
              <p>Fetching latest transaction data...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
