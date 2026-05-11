import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingBag, Users, Package, TrendingUp, Mail, Edit, Trash, Plus, X, LogOut, Home, Eye } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [viewingType, setViewingType] = useState<string>('');

  const [productForm, setProductForm] = useState({
    name: '',
    category_id: 1,
    description: '',
    base_price: 0,
    main_image: '',
    tags: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, usersRes, contactsRes] = await Promise.all([
        client.get('/admin/dashboard'),
        client.get('/admin/orders'),
        client.get('/products'),
        client.get('/admin/users'),
        client.get('/contacts') // Corrected path
      ]);
      setStats(statsRes.data.stats);
      setAllOrders(ordersRes.data.orders);
      setAllProducts(productsRes.data.products);
      setAllUsers(usersRes.data.users);
      setAllContacts(contactsRes.data.contacts || []);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await client.put(`/admin/products/${editingProduct.id}`, productForm);
        toast.success('Product updated!');
      } else {
        await client.post('/admin/products', productForm);
        toast.success('Product added!');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error('Operation failed');
    }
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await client.delete(`/admin/products/${id}`);
      toast.success('Product removed');
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const openDetails = (item: any, type: string) => {
    setViewingItem(item);
    setViewingType(type);
    setIsDetailModalOpen(true);
  };

  const toggleUserRole = async (user: any) => {
    try {
      await client.put(`/admin/users/${user.id}/role`, { is_admin: !user.is_admin });
      toast.success('Role updated!');
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update role');
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <>
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
            <div className="admin-panel">
              <div className="panel-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td>#{order.order_number}</td>
                        <td>{order.user_name}</td>
                        <td>₹{order.total_amount}</td>
                        <td><span className={`order-status ${order.status}`}>{order.status}</span></td>
                        <td><button className="icon-btn-sm" onClick={() => openDetails(order, 'Order')}><Eye size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'orders':
        return (
          <div className="admin-panel">
            <h3>Order Management</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.order_number}</td>
                      <td>{order.user_name}</td>
                      <td>₹{order.total_amount}</td>
                      <td><span className={`badge ${order.payment_status}`}>{order.payment_status}</span></td>
                      <td><span className={`order-status ${order.status}`}>{order.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="icon-btn-sm" onClick={() => openDetails(order, 'Order')}><Eye size={16} /></button>
                          <button className="link-btn">Details</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="admin-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3>Inventory Management</h3>
              <button className="btn-primary" onClick={() => { setEditingProduct(null); setProductForm({ name: '', category_id: 1, description: '', base_price: 0, main_image: '', tags: [] }); setIsProductModalOpen(true); }}>
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.main_image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} /></td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>₹{p.base_price}</td>
                      <td><span className="stock-badge">In Stock</span></td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="icon-btn-sm" onClick={() => openDetails(p, 'Product')}><Eye size={16} /></button>
                        <button className="icon-btn-sm" onClick={() => { setEditingProduct(p); setProductForm({ ...p }); setIsProductModalOpen(true); }}><Edit size={16} /></button>
                        <button className="icon-btn-sm danger" onClick={() => deleteProduct(p.id)}><Trash size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="admin-panel">
            <h3>User Directory</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.is_admin ? 'admin' : 'user'}`}>{u.is_admin ? 'Admin' : 'Customer'}</span></td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="icon-btn-sm" onClick={() => openDetails(u, 'User')}><Eye size={16} /></button>
                        <button className="link-btn" onClick={() => toggleUserRole(u)}>
                          Make {u.is_admin ? 'Customer' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="admin-panel">
            <h3>Customer Inquiries</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allContacts.map((c: any) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{c.email}</div>
                      </td>
                      <td>{c.subject}</td>
                      <td style={{ maxWidth: '200px', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                      <td><button className="icon-btn-sm" onClick={() => openDetails(c, 'Inquiry')}><Eye size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">🛡️ Admin Portal</div>
        <nav className="admin-nav">
          <button className={activeMenu === 'dashboard' ? 'active' : ''} onClick={() => setActiveMenu('dashboard')}><LayoutDashboard size={18} /> Dashboard</button>
          <button className={activeMenu === 'orders' ? 'active' : ''} onClick={() => setActiveMenu('orders')}><ShoppingBag size={18} /> Orders</button>
          <button className={activeMenu === 'products' ? 'active' : ''} onClick={() => setActiveMenu('products')}><Package size={18} /> Products</button>
          <button className={activeMenu === 'customers' ? 'active' : ''} onClick={() => setActiveMenu('customers')}><Users size={18} /> Customers</button>
          <button className={activeMenu === 'contacts' ? 'active' : ''} onClick={() => setActiveMenu('contacts')}><Mail size={18} /> Inquiries</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="admin-avatar" style={{ background: 'var(--green-dark)', color: 'var(--white)', border: 'none' }}>
              {activeMenu === 'dashboard' ? <LayoutDashboard size={20} /> : 
               activeMenu === 'orders' ? <ShoppingBag size={20} /> :
               activeMenu === 'products' ? <Package size={20} /> :
               activeMenu === 'customers' ? <Users size={20} /> : <Mail size={20} />}
            </div>
            <h2 style={{ textTransform: 'capitalize' }}>{activeMenu} Management</h2>
          </div>
          
          <div className="admin-user-profile">
            <div style={{ display: 'flex', gap: '8px', marginRight: '16px', borderRight: '1.5px solid var(--border)', paddingRight: '16px' }}>
              <button className="icon-btn-sm" title="View Store" onClick={() => navigate('/')}><Home size={18} /></button>
              <button className="icon-btn-sm danger" title="Logout" onClick={() => { logout(); navigate('/login'); }}><LogOut size={18} /></button>
            </div>
            <div className="admin-user-info">
              <span className="name">{user?.name || 'System Admin'}</span>
              <span className="role">Senior Administrator</span>
            </div>
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading">🛡️ Updating dashboard data...</div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content admin-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsProductModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={productForm.base_price} onChange={e => setProductForm({...productForm, base_price: Number(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label>Category ID</label>
                  <input type="number" value={productForm.category_id} onChange={e => setProductForm({...productForm, category_id: Number(e.target.value)})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" value={productForm.main_image} onChange={e => setProductForm({...productForm, main_image: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={4} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
              </div>
              <button type="submit" className="auth-btn" style={{ width: '100%', marginTop: '20px' }}>
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Details Modal */}
      {isDetailModalOpen && viewingItem && (
        <div className="modal-overlay">
          <div className="modal-content admin-panel" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid var(--border)', paddingBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{viewingType} Details</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="icon-btn-sm"><X size={20} /></button>
            </div>
            
            <div className="details-grid">
              {Object.entries(viewingItem).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {key.replace(/_/g, ' ')}
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)', wordBreak: 'break-word' }}>
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                     (key.includes('created_at') || key.includes('date')) ? new Date(value as string).toLocaleString() :
                     (key.includes('price') || key.includes('amount')) ? `₹${value}` :
                     String(value)}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="auth-btn" style={{ width: '100%', marginTop: '20px' }} onClick={() => setIsDetailModalOpen(false)}>
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
