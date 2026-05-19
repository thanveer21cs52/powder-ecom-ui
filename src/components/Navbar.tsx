import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import client from '../api/client';

export default function Navbar() {
  const { user } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    client.get('/categories')
      .then(res => {
        if (res.data && res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown-container') && !target.closest('.nav-search-container')) {
        setShowDropdown(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      client.get(`/products?search=${searchQuery}`)
        .then(res => setSearchResults(res.data.products || []))
        .catch(console.error);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Collections', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    ...(user?.is_admin ? [{ name: 'Admin', path: '/admin' }] : [])
  ];

  return (
    <>
      {/* OFFER BAR */}
      <div className="offer-bar">
        <span>🎉 100% Natural Traditional Products — Free Shipping Above ₹499!</span>
        <button className="offer-btn" onClick={() => navigate('/shop')}>Shop Now →</button>
      </div>

      <header>
        <div className="header-inner">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="https://image.qwenlm.ai/public_source/5e7fe444-e1ce-4ec2-aaeb-0a37d63f249f/1b39b99a2-a6b2-4ae5-9bb8-150dabb6bdf6.png" alt="Ayngaran" />
          </div>
          
          <nav>
            {navLinks.map((link) => (
              link.name === 'Our Collections' ? (
                <div key={link.path} className="nav-dropdown-container">
                  <a 
                    href="/shop"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDropdown(!showDropdown);
                    }}
                    className={location.pathname === '/shop' || showDropdown ? 'active-nav' : ''}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {link.name} <span style={{ fontSize: '10px', transition: 'transform 0.3s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </a>
                  {showDropdown && (
                    <div className="nav-dropdown-menu" style={{ width: '640px', display: 'flex', gap: '30px' }}>
                      {/* Left: Collections */}
                      <div style={{ flex: 1.8 }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--green-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', fontWeight: 700 }}>Our Collections</h4>
                        <div className="nav-dropdown-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                          {categories.map((cat) => (
                            <div 
                              key={cat.id} 
                              className="nav-dropdown-item"
                              style={{ padding: '10px 14px', flexDirection: 'row', gap: '10px', justifyContent: 'flex-start' }}
                              onClick={() => {
                                setShowDropdown(false);
                                navigate(`/shop?category=${cat.slug}`);
                              }}
                            >
                              <span className="cat-emoji" style={{ fontSize: '18px', margin: 0 }}>{cat.emoji || '🌿'}</span>
                              <span className="cat-name" style={{ fontSize: '13px', textAlign: 'left', fontWeight: 600 }}>{cat.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Info / Traditional Healthy Foods */}
                      <div style={{ flex: 1.2, borderLeft: '1.5px solid var(--border)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--green-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', fontWeight: 700 }}>Traditional Healthy Foods</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div 
                            style={{ padding: '8px 12px', background: 'var(--cream)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => { setShowDropdown(false); navigate('/shop'); }}
                          >
                            <span>Best Sellers</span>
                            <span style={{ fontSize: '10px', background: 'var(--green-dark)', color: 'var(--white)', padding: '2px 6px', borderRadius: '4px' }}>Top</span>
                          </div>
                          <div 
                            style={{ padding: '8px 12px', background: 'var(--cream)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => { setShowDropdown(false); navigate('/shop'); }}
                          >
                            <span>Combo Products</span>
                            <span style={{ fontSize: '10px', background: 'red', color: 'var(--white)', padding: '2px 6px', borderRadius: '4px' }}>Offers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={location.pathname === link.path ? 'active-nav' : ''}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          <div className="header-icons" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Inline Search Bar */}
            <div className="nav-search-container" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '180px',
                  padding: '6px 12px 6px 32px',
                  borderRadius: '20px',
                  border: '1.5px solid var(--border)',
                  outline: 'none',
                  fontSize: '12px',
                  background: 'var(--cream)',
                  color: 'var(--text-dark)',
                  fontWeight: 500,
                  transition: 'width 0.3s, border-color 0.3s'
                }}
              />
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', pointerEvents: 'none' }}>🔍</span>
              {searchResults.length > 0 && (
                <div 
                  className="search-results-inline"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '260px',
                    background: 'var(--white)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: '8px',
                    marginTop: '8px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    border: '1.5px solid var(--border)'
                  }}
                >
                  {searchResults.map(p => (
                    <div 
                      key={p.id} 
                      className="search-result-item" 
                      onClick={() => {
                        navigate(`/product/${p.id}`);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer'
                      }}
                    >
                      <img src={p.main_image} alt={p.name} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div className="sr-name" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div className="sr-price" style={{ fontSize: '11px', color: 'var(--green-dark)', fontWeight: 700 }}>₹{p.base_price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="icon-btn" title="Wishlist" onClick={() => navigate('/account', { state: { tab: 'wishlist' } })}>♡</div>
            <div className="icon-btn" title="Cart" onClick={toggleCart}>
              🛒
              <span className={`cart-count ${itemCount > 0 ? 'bump' : ''}`}>{itemCount}</span>
            </div>
            
            <div className="user-menu-btn" onClick={() => navigate(user ? '/account' : '/login')}>
              <span>👤</span>
              <span>{user ? (user.is_admin ? 'Admin' : 'Account') : 'Sign In'}</span>
            </div>
 
            <div className={`hamburger ${mobileNavOpen ? 'active' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </header>
 
      {/* MOBILE NAV */}
      <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}>
        <div className="mobile-nav-close" onClick={() => setMobileNavOpen(false)}>✕</div>
        <Link to="/" onClick={() => setMobileNavOpen(false)}>🏠 Home</Link>
        
        {/* Mobile Search */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: '1.5px solid var(--border)',
                outline: 'none',
                fontSize: '13px',
                background: 'var(--cream)',
                color: 'var(--text-dark)'
              }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', pointerEvents: 'none' }}>🔍</span>
            {searchResults.length > 0 && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--white)',
                  boxShadow: 'var(--shadow-lg)',
                  borderRadius: '8px',
                  marginTop: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  border: '1.5px solid var(--border)'
                }}
              >
                {searchResults.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => {
                      navigate(`/product/${p.id}`);
                      setSearchQuery('');
                      setSearchResults([]);
                      setMobileNavOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={p.main_image} alt={p.name} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--green-dark)', fontWeight: 700 }}>₹{p.base_price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 20px' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)} 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}
          >
            <span> Our Collections</span>
            <span style={{ fontSize: '10px' }}>{showDropdown ? '▲' : '▼'}</span>
          </div>
          {showDropdown && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '12px' }}>
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => {
                    setMobileNavOpen(false);
                    setShowDropdown(false);
                    navigate(`/shop?category=${cat.slug}`);
                  }}
                  style={{
                    background: 'var(--cream)',
                    padding: '10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat.emoji} {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/about" onClick={() => setMobileNavOpen(false)}> About Us</Link>
        <Link to="/contact" onClick={() => setMobileNavOpen(false)}>📞 Contact Us</Link>
        <Link to="/account" onClick={() => setMobileNavOpen(false)}>👤 My Account</Link>
      </div>
    </>
  );
}
