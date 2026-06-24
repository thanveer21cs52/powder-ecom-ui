import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import client from '../api/client';
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  Shield,
  User,
  X,
} from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const { user } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const dropdownCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDropdownTimer = () => {
    if (dropdownCloseTimer.current) {
      clearTimeout(dropdownCloseTimer.current);
      dropdownCloseTimer.current = null;
    }
  };

  const openDropdown = () => {
    clearDropdownTimer();
    setShowDropdown(true);
  };

  const closeDropdownSoon = () => {
    clearDropdownTimer();
    dropdownCloseTimer.current = setTimeout(() => {
      setShowDropdown(false);
    }, 180);
  };

  useEffect(() => {
    client
      .get('/categories')
      .then(res => {
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    return () => clearDropdownTimer();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown-container')) {
        clearDropdownTimer();
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    setShowDropdown(false);
    setMobileCollectionsOpen(false);
    setSearchOpen(false);
    setMobileNavOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Collections', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    ...(user?.is_admin ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <>
      <div className="offer-bar">
        <span>100% Natural Traditional Products - Free Shipping Above Rs 499!</span>
        <button className="offer-btn" onClick={() => navigate('/shop')}>
          Shop Now {'→'}
        </button>
      </div>

      <header>
        <div className="header-inner">
          <div className="logo" onClick={() => navigate('/')}>
            <img
              src="https://image.qwenlm.ai/public_source/5e7fe444-e1ce-4ec2-aaeb-0a37d63f249f/1b39b99a2-a6b2-4ae5-9bb8-150dabb6bdf6.png"
              alt="Ayngaran"
            />
          </div>

          <nav>
            {navLinks.map(link =>
              link.name === 'Our Collections' ? (
                <div
                  key={link.path}
                  className="nav-dropdown-container"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdownSoon}
                >
                  <a
                    href="/shop"
                    onClick={e => {
                      e.preventDefault();
                      navigate('/shop');
                    }}
                    className={location.pathname === '/shop' || showDropdown ? 'active-nav' : ''}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {link.name}
                    <ChevronDown
                      size={12}
                      style={{
                        transition: 'transform 0.3s',
                        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </a>

                  {showDropdown && (
                    <div
                      className="nav-dropdown-menu"
                      style={{ width: '420px' }}
                      onMouseEnter={openDropdown}
                      onMouseLeave={closeDropdownSoon}
                    >
                      <div>
                        <h4
                          style={{
                            margin: '0 0 12px 0',
                            fontSize: '14px',
                            color: 'var(--green-dark)',
                            borderBottom: '1px solid var(--border)',
                            paddingBottom: '8px',
                            fontWeight: 700,
                          }}
                        >
                          Our Collections
                        </h4>

                        <div className="nav-dropdown-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                          {categories.map(cat => (
                            <div
                              key={cat.id}
                              className="nav-dropdown-item"
                              style={{
                                padding: '10px 14px',
                                flexDirection: 'row',
                                gap: '10px',
                                justifyContent: 'flex-start',
                              }}
                              onClick={() => {
                                clearDropdownTimer();
                                setShowDropdown(false);
                                navigate(`/shop?category=${cat.slug}`);
                              }}
                            >
                              <span className="cat-emoji" style={{ fontSize: '18px', margin: 0 }}>
                                {cat.emoji || '🌿'}
                              </span>
                              <span className="cat-name" style={{ fontSize: '13px', textAlign: 'left', fontWeight: 600 }}>
                                {cat.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.path} to={link.path} className={location.pathname === link.path ? 'active-nav' : ''}>
                  {link.name}
                </Link>
              )
            )}
          </nav>

          <div className="header-icons" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="icon-btn search-trigger-btn"
              title="Search"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              className="icon-btn"
              title="Wishlist"
              onClick={() => navigate('/account', { state: { tab: 'wishlist' } })}
            >
              <Heart size={18} />
            </button>

            <div className="icon-btn" title="Cart" onClick={toggleCart}>
              <ShoppingCart size={18} />
              <span className={`cart-count ${itemCount > 0 ? 'bump' : ''}`}>{itemCount}</span>
            </div>

            <div className="user-menu-btn" onClick={() => navigate(user ? '/account' : '/login')}>
              <User size={18} />
              <span>{user ? (user.is_admin ? 'Admin' : 'Account') : 'Sign In'}</span>
            </div>

            <button
              type="button"
              className={`hamburger ${mobileNavOpen ? 'active' : ''}`}
              onClick={() => setMobileNavOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}>
        <div className="mobile-nav-close" onClick={closeMobileNav}>
          <X size={20} />
        </div>

        <Link to="/" onClick={closeMobileNav}>
          Home
        </Link>

        <div className="mobile-nav-section-title">Quick Actions</div>
        <div className="mobile-quick-actions">
          <button type="button" onClick={() => { setSearchOpen(true); closeMobileNav(); }}>
            <Search size={16} />
            Search
          </button>
          <button type="button" onClick={() => { closeMobileNav(); navigate('/account', { state: { tab: 'wishlist' } }); }}>
            <Heart size={16} />
            Wishlist
          </button>
          <button type="button" onClick={() => { closeMobileNav(); toggleCart(); }}>
            <ShoppingCart size={16} />
            Cart
          </button>
          <button type="button" onClick={() => { closeMobileNav(); navigate(user ? '/account' : '/login'); }}>
            <User size={16} />
            {user ? 'Account' : 'Sign In'}
          </button>
          {user?.is_admin && (
            <button type="button" onClick={() => { closeMobileNav(); navigate('/admin'); }}>
              <Shield size={16} />
              Admin
            </button>
          )}
        </div>

        <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 20px' }}>
          <button
            type="button"
            onClick={() => setMobileCollectionsOpen(prev => !prev)}
            className="mobile-collections-toggle"
          >
            <span>Our Collections</span>
            <ChevronDown
              size={12}
              style={{
                transform: mobileCollectionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </button>

          {mobileCollectionsOpen && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '12px' }}>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => {
                    closeMobileNav();
                    setMobileCollectionsOpen(false);
                    navigate(`/shop?category=${cat.slug}`);
                  }}
                  style={{
                    background: 'var(--cream)',
                    padding: '10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {cat.emoji} {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/about" onClick={closeMobileNav}>
          About Us
        </Link>
        <Link to="/contact" onClick={closeMobileNav}>
          Contact Us
        </Link>
        <Link to="/account" onClick={closeMobileNav}>
          My Account
        </Link>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
