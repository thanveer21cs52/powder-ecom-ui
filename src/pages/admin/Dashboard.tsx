import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingBag, Users, Package, TrendingUp, Mail, Edit, Trash, Plus, X, LogOut, Home, Eye, Tag, MessageSquare, Star } from 'lucide-react';
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
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allFeedbacks, setAllFeedbacks] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Reset filters and pagination on menu switch
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  }, [activeMenu]);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [viewingType, setViewingType] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    icon?: string;
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    icon: '❓',
    confirmText: 'Confirm'
  });
  
  // Categories forms state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    emoji: '',
    slug: ''
  });

  const [productForm, setProductForm] = useState<any>({
    name: '',
    category_id: 1,
    description: '',
    base_price: 0,
    original_price: 0,
    discount_pct: 0,
    main_image: '',
    image_links: '',
    tags: [],
    variants: [],
    has_discount: false
  });

  // Shipping Carrier & Tracking Form States
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({
    status: '',
    payment_status: '',
    post_service: '',
    tracking_id: ''
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const action = async () => {
      setLoading(true);
      try {
        await client.put(`/admin/orders/${editingOrder.id}/status`, {
          status: orderForm.status,
          payment_status: orderForm.payment_status,
          post_service: orderForm.post_service,
          tracking_id: orderForm.tracking_id
        });
        toast.success('Order updated successfully!');
        setEditingOrder(null);
        await fetchData();
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to update order');
      } finally {
        setLoading(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Update Order & Shipping Details',
      message: `Are you sure you want to update Order #${editingOrder.order_number} to ${orderForm.status.toUpperCase()} and save these details?`,
      onConfirm: action,
      icon: '📦',
      confirmText: 'Yes, Save Changes'
    });
  };

  const deleteReview = (id: number) => {
    const action = async () => {
      setLoading(true);
      try {
        await client.delete(`/admin/reviews/${id}`);
        toast.success('Review removed');
        await fetchData();
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to delete review');
      } finally {
        setLoading(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Delete Product Review',
      message: 'Are you sure you want to permanently delete this product review? This action cannot be undone.',
      onConfirm: action,
      icon: '🗑️',
      confirmText: 'Yes, Delete Review'
    });
  };

  const addVariantField = () => {
    setProductForm((prev: any) => ({
      ...prev,
      variants: [...(prev.variants || []), { weight: '', price_modifier: 0, stock_quantity: 100 }]
    }));
  };

  const removeVariantField = (index: number) => {
    setProductForm((prev: any) => {
      const updated = [...(prev.variants || [])];
      updated.splice(index, 1);
      return { ...prev, variants: updated };
    });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setProductForm((prev: any) => {
      const updated = [...(prev.variants || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, usersRes, contactsRes, categoriesRes, feedbacksRes, reviewsRes] = await Promise.all([
        client.get('/admin/dashboard'),
        client.get('/admin/orders'),
        client.get('/products'),
        client.get('/admin/users'),
        client.get('/contacts'),
        client.get('/categories'),
        client.get('/feedbacks/admin'),
        client.get('/admin/reviews')
      ]);
      setStats(statsRes.data.stats);
      setAllOrders(ordersRes.data.orders);
      setAllProducts(productsRes.data.products);
      setAllUsers(usersRes.data.users);
      setAllContacts(contactsRes.data.contacts || []);
      setAllCategories(categoriesRes.data.categories || []);
      setAllFeedbacks(feedbacksRes.data.feedbacks || []);
      setAllReviews(reviewsRes.data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await client.put(`/categories/${editingCategory.id}`, categoryForm);
        toast.success('Category updated!');
      } else {
        await client.post('/categories', categoryForm);
        toast.success('Category added!');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Operation failed');
      setLoading(false);
    }
  };

  const deleteCategory = (id: number) => {
    const action = async () => {
      setLoading(true);
      try {
        await client.delete(`/categories/${id}`);
        toast.success('Category removed');
        await fetchData();
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to delete');
      } finally {
        setLoading(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: 'Delete this category? Associated products will have their category set to NULL.',
      onConfirm: action,
      icon: '📁',
      confirmText: 'Yes, Delete Category'
    });
  };

  const deleteFeedback = (id: number) => {
    const action = async () => {
      setLoading(true);
      try {
        await client.delete(`/feedbacks/${id}`);
        toast.success('Feedback removed');
        await fetchData();
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to delete');
      } finally {
        setLoading(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Delete Feedback Submission',
      message: 'Are you sure you want to permanently delete this feedback submission?',
      onConfirm: action,
      icon: '💬',
      confirmText: 'Yes, Delete Feedback'
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  const renderSearchFilterBar = (placeholder: string, showFilterSelect = false, filterOptions: { label: string, value: string }[] = []) => {
    return (
      <div className="search-filter-bar" style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', width: '100%' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input 
            type="text" 
            placeholder={placeholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 14px 10px 38px', 
              border: '1.5px solid var(--border)', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'var(--white)',
              outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', fontSize: '14px' }}>🔍</span>
        </div>
        {showFilterSelect && (
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ 
              padding: '10px 16px', 
              border: '1.5px solid var(--border)', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'var(--white)',
              minWidth: '160px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
      </div>
    );
  };
  const renderPagination = (totalItems: number, itemsPerPage: number, currentPage: number, onPageChange: (page: number) => void) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px', padding: '10px 0' }}>
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1.5px solid var(--border)',
            borderRadius: '6px',
            background: 'var(--white)',
            color: currentPage === 1 ? 'var(--text-light)' : 'var(--text-dark)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          Previous
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            style={{
              padding: '8px 12px',
              border: number === currentPage ? '1.5px solid var(--green-dark)' : '1.5px solid var(--border)',
              borderRadius: '6px',
              background: number === currentPage ? 'var(--green-dark)' : 'var(--white)',
              color: number === currentPage ? 'var(--white)' : 'var(--text-dark)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            {number}
          </button>
        ))}
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1.5px solid var(--border)',
            borderRadius: '6px',
            background: 'var(--white)',
            color: currentPage === totalPages ? 'var(--text-light)' : 'var(--text-dark)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          Next
        </button>
      </div>
    );
  };
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.has_discount) {
      const disc = Number(productForm.discount_pct);
      if (isNaN(disc) || disc < 1 || disc > 99) {
        toast.error('Discount percentage must be between 1 and 99!');
        return;
      }
    }
    setLoading(true);
    try {
      const payload = {
        ...productForm,
        original_price: productForm.has_discount ? (Number(productForm.original_price) || 0) : 0,
        discount_pct: productForm.has_discount ? (Number(productForm.discount_pct) || 0) : 0,
        image_links: typeof productForm.image_links === 'string'
          ? productForm.image_links.split(',').map((s: string) => s.trim()).filter(Boolean)
          : (productForm.image_links || []),
        variants: productForm.variants || []
      };

      if (editingProduct) {
        await client.put(`/admin/products/${editingProduct.id}`, payload);
        toast.success('Product updated!');
      } else {
        await client.post('/admin/products', payload);
        toast.success('Product added!');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error('Operation failed');
      setLoading(false);
    }
  };

  const deleteProduct = (id: number) => {
    const action = async () => {
      setLoading(true);
      try {
        await client.delete(`/admin/products/${id}`);
        toast.success('Product removed');
        await fetchData();
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to delete');
      } finally {
        setLoading(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Delete Product Listing',
      message: 'Are you sure you want to delete this product? This will remove it from the store listing.',
      onConfirm: action,
      icon: '📦',
      confirmText: 'Yes, Delete Product'
    });
  };

  const openDetails = (item: any, type: string) => {
    setViewingItem(item);
    setViewingType(type);
    setIsDetailModalOpen(true);
  };

  const SalesTrendChart = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--border)', flex: 1, minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
          No sales trend data available
        </div>
      );
    }
    
    const maxSales = Math.max(...data.map(d => d.sales), 100);
    const chartHeight = 160;
    const chartWidth = 500;
    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;
    
    const points = data.map((d, index) => {
      const x = paddingLeft + (index / (data.length - 1)) * (chartWidth - paddingLeft - paddingRight);
      const y = chartHeight - paddingBottom - (d.sales / maxSales) * (chartHeight - paddingTop - paddingBottom);
      return { x, y, sales: d.sales, date: d.date };
    });
    
    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
    
    const areaD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z` 
      : '';

    return (
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--border)', flex: 1, minWidth: '320px' }}>
        <h4 style={{ marginBottom: '16px', color: 'var(--text-dark)', fontWeight: 600 }}>Sales Trend Overview (Last 15 Days)</h4>
        <div style={{ position: 'relative', width: '100%' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <line x1={paddingLeft} y1={paddingTop} x2={chartWidth - paddingRight} y2={paddingTop} stroke="var(--border)" strokeDasharray="4 4" />
            <line x1={paddingLeft} y1={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop} x2={chartWidth - paddingRight} y2={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop} stroke="var(--border)" strokeDasharray="4 4" />
            <line x1={paddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingRight} y2={chartHeight - paddingBottom} stroke="var(--border)" strokeWidth="1.5" />
            
            {areaD && <path d={areaD} fill="rgba(46, 117, 89, 0.08)" />}
            {pathD && <path d={pathD} fill="none" stroke="var(--green-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
            
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="var(--green)" stroke="var(--white)" strokeWidth="1" />
                <title>{`${p.date}\n₹${p.sales.toLocaleString()}`}</title>
              </g>
            ))}
            
            {points.filter((_, idx) => idx % Math.max(1, Math.floor(points.length / 4)) === 0 || idx === points.length - 1).map((p, idx) => (
              <text key={idx} x={p.x} y={chartHeight - 10} textAnchor="middle" fill="var(--text-light)" fontSize="9" fontWeight="600">
                {p.date.split('-').slice(1).join('/')}
              </text>
            ))}
            
            <text x={paddingLeft - 10} y={paddingTop + 3} textAnchor="end" fill="var(--text-light)" fontSize="9" fontWeight="600">₹{Math.round(maxSales).toLocaleString()}</text>
            <text x={paddingLeft - 10} y={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop + 3} textAnchor="end" fill="var(--text-light)" fontSize="9" fontWeight="600">₹{Math.round(maxSales / 2).toLocaleString()}</text>
            <text x={paddingLeft - 10} y={chartHeight - paddingBottom + 3} textAnchor="end" fill="var(--text-light)" fontSize="9" fontWeight="600">₹0</text>
          </svg>
        </div>
      </div>
    );
  };

  const CategorySalesChart = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--border)', flex: 1, minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
          No category data available
        </div>
      );
    }
    
    const displayData = data.slice(0, 5);
    const maxVal = Math.max(...displayData.map(d => d.totalSales), 100);
    
    return (
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--border)', flex: 1, minWidth: '320px' }}>
        <h4 style={{ marginBottom: '20px', color: 'var(--text-dark)', fontWeight: 600 }}>Category Performance Breakdown</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayData.map((c, i) => {
            const percentage = (c.totalSales / maxVal) * 100;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)' }}>
                    <span style={{ fontSize: '16px' }}>{c.emoji}</span>
                    <span>{c.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 'normal' }}>({c.productCount} items)</span>
                  </span>
                  <span style={{ color: 'var(--green-dark)' }}>₹{c.totalSales.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(percentage, 2)}%`, height: '100%', background: 'linear-gradient(90deg, var(--green), var(--green-dark))', borderRadius: '4px' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const StatusBreakdown = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--border)', width: '100%', maxWidth: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
          No status breakdown
        </div>
      );
    }
    
    const total = data.reduce((acc, d) => acc + d.count, 0);
    
    return (
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--border)', width: '100%', maxWidth: '380px' }}>
        <h4 style={{ marginBottom: '20px', color: 'var(--text-dark)', fontWeight: 600 }}>Order Status Metrics</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.map((d, i) => {
            const pct = ((d.count / total) * 100).toFixed(0);
            const colorMap: any = {
              processing: 'var(--yellow)',
              pending: 'var(--yellow-dark)',
              shipped: 'var(--blue)',
              delivered: 'var(--green)',
              cancelled: 'var(--red)'
            };
            const badgeColor = colorMap[d.status] || 'var(--text-mid)';
            
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: badgeColor }}></div>
                  <span style={{ textTransform: 'capitalize', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>{d.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{d.count} orders</span>
                  <span style={{ color: 'var(--text-light)', width: '36px', textAlign: 'right' }}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TopProductsList = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--border)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
          No product metrics available
        </div>
      );
    }
    
    return (
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1.5px solid var(--border)', flex: 1 }}>
        <h4 style={{ marginBottom: '20px', color: 'var(--text-dark)', fontWeight: 600 }}>Top Selling Products</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {data.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: i < data.length - 1 ? '1.5px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={p.mainImage} alt="" style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{p.orderCount} unique orders</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--green-dark)' }}>₹{p.revenue.toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{p.totalQuantity} units sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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

            {/* Charts Grid */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <SalesTrendChart data={stats?.salesTrend} />
              <CategorySalesChart data={stats?.categorySales} />
            </div>

            {/* Metrics Breakdown Grid */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <TopProductsList data={stats?.topProducts} />
              <StatusBreakdown data={stats?.statusDistribution} />
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
      case 'orders': {
        const filteredOrders = allOrders.filter(order => {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            (order.order_number || '').toString().toLowerCase().includes(searchLower) ||
            (order.user_name || '').toLowerCase().includes(searchLower) ||
            (order.email || '').toLowerCase().includes(searchLower);
          
          const matchesFilter = statusFilter === 'all' 
            ? true 
            : (order.status || '').toLowerCase() === statusFilter.toLowerCase();
          
          return matchesSearch && matchesFilter;
        });

        const filterOptions = [
          { label: 'All Statuses', value: 'all' },
          { label: 'Processing', value: 'processing' },
          { label: 'Packed', value: 'packed' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Returned', value: 'returned' }
        ];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

        return (
          <div className="admin-panel">
            <h3>Order Management</h3>
            {renderSearchFilterBar('Search by order number, customer name or email...', true, filterOptions)}
            <div className="admin-table-container">
              {paginatedOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mid)' }}>No matching orders found.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Tracking ID</th>
                      <th>Updated By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.order_number}</td>
                        <td>{order.user_name}</td>
                        <td>₹{order.total_amount}</td>
                        <td><span className={`badge ${order.payment_status}`}>{order.payment_status}</span></td>
                        <td><span className={`order-status ${order.status}`}>{order.status}</span></td>
                        <td style={{ fontSize: '13px', fontWeight: 500 }}>{order.tracking_id || '-'}</td>
                        <td style={{ fontSize: '13px', color: 'var(--text-light)' }}>{order.updated_by_name || '-'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="icon-btn-sm" onClick={() => openDetails(order, 'Order')} title="View details"><Eye size={16} /></button>
                            <button className="icon-btn-sm" onClick={() => {
                              setEditingOrder(order);
                              setOrderForm({
                                status: order.status,
                                payment_status: order.payment_status || 'pending',
                                post_service: order.post_service || '',
                                tracking_id: order.tracking_id || ''
                              });
                            }} title="Edit order status & shipping info"><Edit size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {renderPagination(filteredOrders.length, itemsPerPage, currentPage, setCurrentPage)}
          </div>
        );
      }
      case 'products': {
        const filteredProducts = allProducts.filter(p => {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = p.name.toLowerCase().includes(searchLower);
          
          const matchesFilter = statusFilter === 'all'
            ? true
            : p.category_id?.toString() === statusFilter;
          
          return matchesSearch && matchesFilter;
        });

        const categoryFilterOptions = [
          { label: 'All Categories', value: 'all' },
          ...allCategories.map((c: any) => ({ label: `${c.emoji} ${c.name}`, value: c.id.toString() }))
        ];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

        return (
          <div className="admin-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3>Inventory Management</h3>
              <button className="btn-primary" onClick={() => { setEditingProduct(null); setProductForm({ name: '', category_id: 1, description: '', base_price: 0, original_price: 0, discount_pct: 0, main_image: '', image_links: '', tags: [], variants: [], has_discount: false }); setIsProductModalOpen(true); }}>
                <Plus size={18} /> Add Product
              </button>
            </div>
            {renderSearchFilterBar('Search by product name...', true, categoryFilterOptions)}
            <div className="admin-table-container">
              {paginatedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mid)' }}>No matching products found.</div>
              ) : (
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
                    {paginatedProducts.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.main_image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} /></td>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td>₹{p.base_price}</td>
                        <td><span className="stock-badge">In Stock</span></td>
                        <td style={{ display: 'flex', gap: '8px' }}>
                          <button className="icon-btn-sm" onClick={() => openDetails(p, 'Product')}><Eye size={16} /></button>
                          <button className="icon-btn-sm" onClick={() => { 
                            const hasDiscount = (p.discount_pct && p.discount_pct > 0) || (p.original_price && p.original_price > p.base_price);
                            setEditingProduct(p); 
                            setProductForm({ 
                              ...p, 
                              original_price: p.original_price || 0,
                              discount_pct: p.discount_pct || 0,
                              image_links: Array.isArray(p.image_links) ? p.image_links.join(', ') : (p.image_links || ''),
                              variants: p.variants || [],
                              has_discount: !!hasDiscount
                            }); 
                            setIsProductModalOpen(true); 
                          }}><Edit size={16} /></button>
                          <button className="icon-btn-sm danger" onClick={() => deleteProduct(p.id)}><Trash size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {renderPagination(filteredProducts.length, itemsPerPage, currentPage, setCurrentPage)}
          </div>
        );
      }
      case 'customers': {
        const filteredUsers = allUsers.filter(u => {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            (u.full_name || '').toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower);
          
          const matchesFilter = statusFilter === 'all'
            ? true
            : statusFilter === 'admin' ? u.is_admin : !u.is_admin;
          
          return matchesSearch && matchesFilter;
        });

        const userFilterOptions = [
          { label: 'All Roles', value: 'all' },
          { label: 'Admin Only', value: 'admin' },
          { label: 'Customers Only', value: 'customer' }
        ];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

        return (
          <div className="admin-panel">
            <h3>User Directory</h3>
            {renderSearchFilterBar('Search by name or email...', true, userFilterOptions)}
            <div className="admin-table-container">
              {paginatedUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mid)' }}>No matching users found.</div>
              ) : (
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
                    {paginatedUsers.map(u => (
                      <tr key={u.id}>
                        <td>{u.full_name}</td>
                        <td>{u.email}</td>
                        <td>
                          <select 
                            value={u.is_admin ? 'admin' : 'customer'} 
                            onChange={(e) => {
                              const targetVal = e.target.value;
                              const newAdmin = targetVal === 'admin';
                              
                              const action = async () => {
                                setLoading(true);
                                try {
                                  await client.put(`/admin/users/${u.id}/role`, { is_admin: newAdmin });
                                  toast.success('Role updated successfully!');
                                  await fetchData();
                                } catch (err: any) {
                                  console.error(err);
                                  toast.error('Failed to update role');
                                } finally {
                                  setLoading(false);
                                }
                              };

                              setConfirmModal({
                                isOpen: true,
                                title: 'Change User Role',
                                message: u.id === user?.id && !newAdmin 
                                  ? 'Are you sure you want to remove your own Admin role? You will lose access to this dashboard.' 
                                  : `Are you sure you want to change ${u.full_name}'s role to ${newAdmin ? 'Admin' : 'Customer'}?`,
                                onConfirm: action,
                                icon: '🛡️',
                                confirmText: 'Yes, Change Role'
                              });
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid var(--border)',
                              background: 'var(--white)',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: 'var(--text-dark)',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="icon-btn-sm" onClick={() => openDetails(u, 'User')} title="View details"><Eye size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {renderPagination(filteredUsers.length, itemsPerPage, currentPage, setCurrentPage)}
          </div>
        );
      }
      case 'contacts': {
        const filteredContacts = allContacts.filter((c: any) => {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            c.name.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            (c.subject || '').toLowerCase().includes(searchLower) ||
            c.message.toLowerCase().includes(searchLower);
          
          return matchesSearch;
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

        return (
          <div className="admin-panel">
            <h3>Customer Inquiries</h3>
            {renderSearchFilterBar('Search by name, email, subject or message...')}
            <div className="admin-table-container">
              {paginatedContacts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mid)' }}>No matching inquiries found.</div>
              ) : (
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
                    {paginatedContacts.map((c: any) => (
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
              )}
            </div>
            {renderPagination(filteredContacts.length, itemsPerPage, currentPage, setCurrentPage)}
          </div>
        );
      }
      case 'categories': {
        const filteredCategories = allCategories.filter((c: any) => {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            c.name.toLowerCase().includes(searchLower) ||
            c.slug.toLowerCase().includes(searchLower);
          
          return matchesSearch;
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

        return (
          <div className="admin-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3>Categories</h3>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '14px' }} onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', emoji: '📁', slug: '' });
                setIsCategoryModalOpen(true);
              }}>
                <Plus size={16} /> Add Category
              </button>
            </div>
            {renderSearchFilterBar('Search categories by name or slug...')}
            <div className="admin-table-container">
              {paginatedCategories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mid)' }}>No matching categories found.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Emoji</th>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCategories.map((c: any) => (
                      <tr key={c.id}>
                        <td style={{ fontSize: '24px' }}>{c.emoji}</td>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td><code>{c.slug}</code></td>
                        <td style={{ display: 'flex', gap: '8px' }}>
                          <button className="icon-btn-sm" onClick={() => {
                            setEditingCategory(c);
                            setCategoryForm({ name: c.name, emoji: c.emoji, slug: c.slug });
                            setIsCategoryModalOpen(true);
                          }}><Edit size={16} /></button>
                          <button className="icon-btn-sm danger" onClick={() => deleteCategory(c.id)}><Trash size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {renderPagination(filteredCategories.length, itemsPerPage, currentPage, setCurrentPage)}
          </div>
        );
      }
      case 'feedbacks': {
        const filteredFeedbacks = allFeedbacks.filter((f: any) => {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            f.name.toLowerCase().includes(searchLower) ||
            f.email.toLowerCase().includes(searchLower) ||
            f.message.toLowerCase().includes(searchLower);
          
          const matchesFilter = statusFilter === 'all'
            ? true
            : f.rating?.toString() === statusFilter;
          
          return matchesSearch && matchesFilter;
        });

        const ratingFilterOptions = [
          { label: 'All Ratings', value: 'all' },
          { label: '5 Stars ★★★★★', value: '5' },
          { label: '4 Stars ★★★★☆', value: '4' },
          { label: '3 Stars ★★★☆☆', value: '3' },
          { label: '2 Stars ★★☆☆☆', value: '2' },
          { label: '1 Star ★☆☆☆☆', value: '1' }
        ];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, startIndex + itemsPerPage);

        return (
          <div className="admin-panel">
            <h3>Customer Feedbacks</h3>
            {renderSearchFilterBar('Search by name, email or message...', true, ratingFilterOptions)}
            <div className="admin-table-container">
              {paginatedFeedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mid)' }}>No matching feedbacks found.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer Info</th>
                      <th>Rating</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFeedbacks.map((f: any) => (
                      <tr key={f.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{f.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{f.email}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '2px', color: 'var(--yellow)', fontSize: '16px' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>{i < f.rating ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ maxWidth: '300px', wordWrap: 'break-word', whiteSpace: 'normal', fontSize: '13px' }}>
                          {f.message}
                        </td>
                        <td>{new Date(f.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="icon-btn-sm danger" onClick={() => deleteFeedback(f.id)}>
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {renderPagination(filteredFeedbacks.length, itemsPerPage, currentPage, setCurrentPage)}
          </div>
        );
      }
      case 'reviews': {
        const filteredReviews = allReviews.filter((r: any) => {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            (r.product_name || '').toLowerCase().includes(searchLower) ||
            (r.user_name || '').toLowerCase().includes(searchLower) ||
            (r.comment || '').toLowerCase().includes(searchLower);
          
          const matchesFilter = statusFilter === 'all'
            ? true
            : r.rating?.toString() === statusFilter;
          
          return matchesSearch && matchesFilter;
        });

        const ratingFilterOptions = [
          { label: 'All Ratings', value: 'all' },
          { label: '5 Stars ★★★★★', value: '5' },
          { label: '4 Stars ★★★★☆', value: '4' },
          { label: '3 Stars ★★★☆☆', value: '3' },
          { label: '2 Stars ★★☆☆☆', value: '2' },
          { label: '1 Star ★☆☆☆☆', value: '1' }
        ];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

        return (
          <div className="admin-panel">
            <h3>Product Reviews</h3>
            {renderSearchFilterBar('Search by product, customer or review...', true, ratingFilterOptions)}
            <div className="admin-table-container">
              {paginatedReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mid)' }}>No product reviews found.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>User</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReviews.map((r: any) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.product_name}</td>
                        <td>{r.user_name || 'Anonymous'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '2px', color: 'var(--yellow)', fontSize: '16px' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>{i < r.rating ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ maxWidth: '300px', wordWrap: 'break-word', whiteSpace: 'normal', fontSize: '13px' }}>{r.comment}</td>
                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="icon-btn-sm danger" onClick={() => deleteReview(r.id)}><Trash size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {renderPagination(filteredReviews.length, itemsPerPage, currentPage, setCurrentPage)}
          </div>
        );
      }
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
          <button className={activeMenu === 'categories' ? 'active' : ''} onClick={() => setActiveMenu('categories')}><Tag size={18} /> Categories</button>
          <button className={activeMenu === 'customers' ? 'active' : ''} onClick={() => setActiveMenu('customers')}><Users size={18} /> Customers</button>
          <button className={activeMenu === 'contacts' ? 'active' : ''} onClick={() => setActiveMenu('contacts')}><Mail size={18} /> Inquiries</button>
          <button className={activeMenu === 'feedbacks' ? 'active' : ''} onClick={() => setActiveMenu('feedbacks')}><MessageSquare size={18} /> Feedbacks</button>
          <button className={activeMenu === 'reviews' ? 'active' : ''} onClick={() => setActiveMenu('reviews')}><Star size={18} /> Reviews</button>
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
               activeMenu === 'customers' ? <Users size={20} /> : 
               activeMenu === 'contacts' ? <Mail size={20} /> :
               activeMenu === 'categories' ? <Tag size={20} /> :
               activeMenu === 'feedbacks' ? <MessageSquare size={20} /> : <Star size={20} />}
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
          <div className="admin-loading" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
            <span style={{ fontSize: '14px', color: 'var(--text-mid)', fontWeight: 600 }}>Syncing administrative data...</span>
          </div>
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
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: 600 }}>Enable Discount?</label>
                <select 
                  value={productForm.has_discount ? 'yes' : 'no'}
                  onChange={e => {
                    const isYes = e.target.value === 'yes';
                    setProductForm({
                      ...productForm,
                      has_discount: isYes,
                      original_price: isYes ? (productForm.original_price || productForm.base_price) : 0,
                      discount_pct: isYes ? (productForm.discount_pct || 0) : 0
                    });
                  }}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--white)' }}
                >
                  <option value="no">No Discount (Base price only)</option>
                  <option value="yes">Yes, apply discount %</option>
                </select>
              </div>

              {productForm.has_discount ? (
                <div className="form-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Original Price (₹)</label>
                    <input 
                      type="number" 
                      value={productForm.original_price || ''} 
                      onChange={e => {
                        const orig = Number(e.target.value);
                        const disc = productForm.discount_pct || 0;
                        const base = Math.round(orig * (1 - disc / 100));
                        setProductForm({
                          ...productForm,
                          original_price: orig,
                          base_price: base
                        });
                      }} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Discount (%) (1-99)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="99"
                      value={productForm.discount_pct || ''} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val === '') {
                          setProductForm({
                            ...productForm,
                            discount_pct: '',
                            base_price: productForm.original_price || 0
                          });
                          return;
                        }
                        let disc = Number(val);
                        if (disc < 1) disc = 1;
                        if (disc > 99) disc = 99;
                        const orig = productForm.original_price || 0;
                        const base = Math.round(orig * (1 - disc / 100));
                        setProductForm({
                          ...productForm,
                          discount_pct: disc,
                          base_price: base
                        });
                      }} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Base Selling Price (Auto Calculated ₹)</label>
                    <input 
                      type="number" 
                      value={productForm.base_price} 
                      readOnly 
                      style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Base Selling Price (₹)</label>
                  <input 
                    type="number" 
                    value={productForm.base_price} 
                    onChange={e => setProductForm({...productForm, base_price: Number(e.target.value)})} 
                    required 
                  />
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Category</label>
                <select 
                  value={productForm.category_id} 
                  onChange={e => setProductForm({...productForm, category_id: Number(e.target.value)})} 
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--white)' }}
                  required
                >
                  <option value="">Select Category</option>
                  {allCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Main Image URL</label>
                <input type="text" value={productForm.main_image} onChange={e => setProductForm({...productForm, main_image: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Additional Image Links (Comma-separated URLs)</label>
                <textarea 
                  rows={2}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--white)' }}
                  value={productForm.image_links || ''} 
                  onChange={e => setProductForm({...productForm, image_links: e.target.value})} 
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Description</label>
                <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
              </div>

              {/* Variants / Weights / Stock Editor */}
              <div style={{ marginBottom: '20px', border: '1.5px solid var(--border)', padding: '16px', borderRadius: '12px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>Product Weights & Stock</h4>
                  <button type="button" onClick={addVariantField} style={{ background: 'var(--green-pale)', color: 'var(--green-dark)', padding: '6px 12px', border: '1px solid var(--green-mid)', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                    + Add Weight Option
                  </button>
                </div>
                
                {(!productForm.variants || productForm.variants.length === 0) ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', textAlign: 'center', padding: '12px' }}>
                    No variants added. Uses base price and standard stock.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {productForm.variants.map((v: any, index: number) => (
                      <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          placeholder="Weight (e.g. 100g)" 
                          value={v.weight || ''} 
                          onChange={e => handleVariantChange(index, 'weight', e.target.value)} 
                          style={{ flex: 2, padding: '8px', fontSize: '12px', borderRadius: '6px', border: '1.5px solid var(--border)' }}
                          required
                        />
                        <input 
                          type="number" 
                          placeholder="Price Mod (+/- ₹)" 
                          value={v.price_modifier === 0 ? '' : v.price_modifier} 
                          onChange={e => handleVariantChange(index, 'price_modifier', Number(e.target.value))} 
                          style={{ flex: 1.5, padding: '8px', fontSize: '12px', borderRadius: '6px', border: '1.5px solid var(--border)' }}
                          required
                        />
                        <input 
                          type="number" 
                          placeholder="Stock Quantity" 
                          value={v.stock_quantity === 0 ? '' : v.stock_quantity} 
                          onChange={e => handleVariantChange(index, 'stock_quantity', Number(e.target.value))} 
                          style={{ flex: 1.5, padding: '8px', fontSize: '12px', borderRadius: '6px', border: '1.5px solid var(--border)' }}
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => removeVariantField(index)} 
                          style={{ color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', fontSize: '16px', fontWeight: 'bold' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="auth-btn" style={{ width: '100%', marginTop: '10px' }}>
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content admin-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}><X size={24} /></button>
            </div>
            <form onSubmit={handleCategorySubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  type="text" 
                  value={categoryForm.name} 
                  onChange={e => {
                    const val = e.target.value;
                    const autoSlug = val
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    setCategoryForm({
                      ...categoryForm,
                      name: val,
                      slug: autoSlug
                    });
                  }} 
                  placeholder="e.g. Skin Care"
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Emoji Icon</label>
                  <input 
                    type="text" 
                    value={categoryForm.emoji} 
                    onChange={e => setCategoryForm({...categoryForm, emoji: e.target.value})} 
                    placeholder="e.g. 💆"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Slug URL (auto-generated)</label>
                  <input 
                    type="text" 
                    value={categoryForm.slug} 
                    onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})} 
                    placeholder="e.g. skincare"
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="auth-btn" style={{ width: '100%', marginTop: '20px' }}>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="modal-overlay">
          <div className="modal-content admin-panel" style={{ maxWidth: '500px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Update Order #{editingOrder.order_number}</h3>
              <button onClick={() => setEditingOrder(null)} className="icon-btn-sm"><X size={24} /></button>
            </div>
            <form onSubmit={handleOrderSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Order Status</label>
                <select
                  value={orderForm.status}
                  onChange={e => setOrderForm({ ...orderForm, status: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--white)', fontWeight: 600 }}
                  required
                >
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Payment Status</label>
                <select
                  value={orderForm.payment_status}
                  onChange={e => setOrderForm({ ...orderForm, payment_status: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--white)', fontWeight: 600 }}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Postal / Courier Service Carrier</label>
                <input
                  type="text"
                  placeholder="e.g. India Post, DHL, FedEx"
                  value={orderForm.post_service}
                  onChange={e => setOrderForm({ ...orderForm, post_service: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--white)' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Tracking Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. TRK12345678"
                  value={orderForm.tracking_id}
                  onChange={e => setOrderForm({ ...orderForm, tracking_id: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--white)' }}
                />
              </div>

              <button type="submit" className="auth-btn" style={{ width: '100%' }}>
                Save Order Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailModalOpen && viewingItem && (
        <div className="modal-overlay">
          <div className="modal-content admin-panel" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid var(--border)', paddingBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{viewingType} Details</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="icon-btn-sm"><X size={20} /></button>
            </div>
            
            {viewingType === 'Order' ? (
              <div className="details-grid">
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Order Number</label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>#{viewingItem.order_number}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Customer</label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{viewingItem.user_name} ({viewingItem.email || 'N/A'})</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Shipping Address</label>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>{viewingItem.shipping_address}</div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Status</label>
                    <div className={`order-status ${viewingItem.status}`} style={{ display: 'inline-block', textTransform: 'capitalize', fontSize: '12px' }}>{viewingItem.status}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Payment Status</label>
                    <div className={`badge ${viewingItem.payment_status}`} style={{ display: 'inline-block', textTransform: 'capitalize', fontSize: '12px' }}>{viewingItem.payment_status}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Post / Courier Service</label>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)' }}>{viewingItem.post_service || 'Not Dispatched'}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Tracking ID</label>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)' }}>{viewingItem.tracking_id || 'N/A'}</div>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Last Updated By</label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{viewingItem.updated_by_name ? `Admin: ${viewingItem.updated_by_name}` : 'Original Creator (Checkout System)'}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Amount</label>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green-dark)' }}>₹{viewingItem.total_amount}</div>
                </div>
                <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>Ordered Products</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {viewingItem.items && viewingItem.items.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px' }}>
                        <div>
                          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{item.product_name}</span>
                          {item.variant_weight && <span style={{ color: 'var(--text-light)', marginLeft: '6px' }}>({item.variant_weight})</span>}
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                          {item.quantity} x ₹{item.price_at_purchase}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="details-grid">
                {Object.entries(viewingItem)
                  .filter(([key]) => key !== 'password_hash' && key !== 'variants' && key !== 'image_links')
                  .map(([key, value]) => (
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
            )}
            
            <button className="auth-btn" style={{ width: '100%', marginTop: '20px' }} onClick={() => setIsDetailModalOpen(false)}>
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content admin-panel" style={{ maxWidth: '400px', width: '90%', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{confirmModal.icon || '❓'}</div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>{confirmModal.title}</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-light)', lineHeight: 1.5 }}>{confirmModal.message}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                type="button"
                onClick={() => {
                  if (confirmModal.onCancel) confirmModal.onCancel();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                style={{ 
                  flex: 1, 
                  padding: '10px 16px', 
                  border: '1.5px solid var(--border)', 
                  borderRadius: '8px', 
                  background: 'var(--white)', 
                  cursor: 'pointer', 
                  fontWeight: 600,
                  color: 'var(--text-dark)'
                }}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                style={{ 
                  flex: 1, 
                  padding: '10px 16px', 
                  border: 'none', 
                  borderRadius: '8px', 
                  background: 'var(--green-dark)', 
                  color: 'var(--white)', 
                  cursor: 'pointer', 
                  fontWeight: 600 
                }}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
