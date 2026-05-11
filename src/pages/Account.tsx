import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client';
import SkeletonProduct from '../components/SkeletonProduct';

type Tab = 'orders' | 'wishlist' | 'profile' | 'addresses';

export default function Account() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>((location.state as any)?.tab || 'orders');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  
  // Profile state
  const [profName, setProfName] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profAddress, setProfAddress] = useState('');
  const [profPw, setProfPw] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      setProfName(user.name || '');
      setProfPhone(user.phone || '');
      setProfAddress(user.address || '');
      
      if (activeTab === 'orders') {
        setLoadingOrders(true);
        client.get('/orders/myorders')
          .then(res => setOrders(res.data.orders || []))
          .catch(err => toast.error('Failed to load orders'))
          .finally(() => setLoadingOrders(false));
      }
      
      if (activeTab === 'wishlist') {
        setLoadingWishlist(true);
        client.get('/wishlist')
          .then(res => setWishlist(res.data.items || []))
          .catch(err => toast.error('Failed to load wishlist'))
          .finally(() => setLoadingWishlist(false));
      }
    }
  }, [user, activeTab]);

  if (!user) {
    return (
      <div className="page active" id="page-account" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Please log in to view your account.</h2>
        <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await client.put('/auth/profile', { 
        name: profName, 
        phone: profPhone, 
        password: profPw,
        address: profAddress 
      });
      if (res.data.success) {
        const token = localStorage.getItem('token');
        if (token) login(token, res.data.user);
        toast.success('Profile updated successfully!');
        setProfPw('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page active" id="page-account">
      <div className="page-hero">
        <h1>👤 My Account</h1>
        <p>Manage your orders and profile</p>
      </div>
      <div className="account-layout">
        <div className="account-sidebar">
          <div className="account-user-info">
            <div className="account-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="account-user-name">{user.name}</div>
            <div className="account-user-email">{user.email}</div>
          </div>
          <div className="account-nav">
            <a onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>📦 My Orders</a>
            <a onClick={() => setActiveTab('wishlist')} className={activeTab === 'wishlist' ? 'active' : ''}>♡ Wishlist</a>
            <a onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>⚙️ Profile Settings</a>
            <a onClick={() => setActiveTab('addresses')} className={activeTab === 'addresses' ? 'active' : ''}>📍 Saved Addresses</a>
            <a onClick={handleLogout} className="logout">🚪 Logout</a>
          </div>
        </div>
        
        <div className="account-content">
          {activeTab === 'orders' && (
            <div className="account-panel active">
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>My Orders</h2>
              <div className="ordersList">
                {loadingOrders ? (
                  <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div className="skeleton skeleton-text" style={{ width: '120px', height: '20px' }}></div>
                      <div className="skeleton skeleton-text" style={{ width: '80px', height: '20px' }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '8px' }}></div>
                      <div style={{ flex: 1 }}>
                        <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px' }}></div>
                        <div className="skeleton skeleton-text short" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', background: 'var(--cream)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
                    <p>You haven't placed any orders yet.</p>
                    <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/shop')}>Start Shopping</button>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--green-dark)' }}>Order #{order.order_number}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700 }}>₹{order.total_amount}</div>
                          <div style={{ fontSize: '12px', padding: '4px 10px', background: 'var(--green-pale)', color: 'var(--green-dark)', borderRadius: '20px', display: 'inline-block', marginTop: '4px', textTransform: 'capitalize' }}>
                            {order.status}
                          </div>
                        </div>
                      </div>
                      <div>
                        {order.items.map((item: any, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                            <img src={item.main_image} alt={item.product_name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.product_name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-mid)' }}>Qty: {item.quantity} × ₹{item.price_at_purchase}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="account-panel active">
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>My Wishlist</h2>
              {loadingWishlist ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {[1, 2, 3, 4].map(i => <SkeletonProduct key={i} />)}
                </div>
              ) : wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--cream)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>♡</div>
                  <p>Your wishlist is currently empty.</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '8px' }}>Start adding your favorite traditional foods!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {wishlist.map(item => (
                    <div key={item.id} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                      <img src={item.main_image} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>{item.name}</div>
                      <div style={{ color: 'var(--green-dark)', fontWeight: 700, marginBottom: '12px' }}>₹{item.base_price}</div>
                      <button className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '13px' }} onClick={() => {
                        client.delete(`/wishlist/${item.product_id}`).then(() => {
                          setWishlist(w => w.filter(i => i.product_id !== item.product_id));
                          toast.success('Removed from wishlist');
                        });
                      }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="account-panel active">
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Profile Settings</h2>
              <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '32px' }}>
                <div className="form-row">
                  <div className="form-group"><label>Full Name</label><input type="text" value={profName} onChange={e => setProfName(e.target.value)} /></div>
                  <div className="form-group"><label>Phone</label><input type="tel" value={profPhone} onChange={e => setProfPhone(e.target.value)} placeholder="Enter phone" /></div>
                </div>
                <div className="form-group"><label>Email</label><input type="email" value={user.email} disabled style={{ opacity: 0.6 }} /></div>
                <div className="form-group"><label>Shipping Address</label><textarea value={profAddress} onChange={e => setProfAddress(e.target.value)} placeholder="Enter your full address" style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit' }} /></div>
                <div className="form-group"><label>New Password (leave blank to keep current)</label><input type="password" value={profPw} onChange={e => setProfPw(e.target.value)} placeholder="New password" /></div>
                <button className="btn-primary" onClick={handleProfileUpdate} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="account-panel active">
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Saved Addresses</h2>
              
              {!isEditingAddress ? (
                <>
                  <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0 }}>Default Address</h4>
                      {user.address && <button className="link-btn" onClick={() => setIsEditingAddress(true)} style={{ color: 'var(--green-dark)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>}
                    </div>
                    {user.address ? (
                      <p style={{ color: 'var(--text-mid)', fontSize: '14px', whiteSpace: 'pre-wrap', margin: 0 }}>{user.address}</p>
                    ) : (
                      <p style={{ color: 'var(--text-light)', fontSize: '14px', margin: 0 }}>No saved addresses yet.</p>
                    )}
                  </div>
                  {!user.address && <button className="btn-outline" onClick={() => setIsEditingAddress(true)}>+ Add New Address</button>}
                </>
              ) : (
                <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                  <h4 style={{ marginBottom: '16px' }}>{user.address ? 'Edit Address' : 'Add New Address'}</h4>
                  <textarea 
                    value={profAddress} 
                    onChange={e => setProfAddress(e.target.value)} 
                    placeholder="Enter your full shipping address (Street, City, State, Pincode)" 
                    style={{ width: '100%', padding: '16px', border: '1.5px solid var(--border)', borderRadius: '12px', minHeight: '150px', marginBottom: '20px', fontFamily: 'inherit' }} 
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" onClick={async () => {
                      await handleProfileUpdate();
                      setIsEditingAddress(false);
                    }} disabled={isUpdating}>
                      {isUpdating ? 'Saving...' : 'Save Address'}
                    </button>
                    <button className="btn-outline" onClick={() => {
                      setProfAddress(user.address || '');
                      setIsEditingAddress(false);
                    }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
