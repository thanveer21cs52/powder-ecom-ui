import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const { user } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Products', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
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
              <Link 
                key={link.path} 
                to={link.path} 
                className={location.pathname === link.path ? 'active-nav' : ''}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="header-icons">
            <div className="icon-btn" title="Search" onClick={() => setIsSearchOpen(true)}>🔍</div>
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
        <Link to="/shop" onClick={() => setMobileNavOpen(false)}> Our Products</Link>
        <Link to="/about" onClick={() => setMobileNavOpen(false)}> About Us</Link>
        <Link to="/contact" onClick={() => setMobileNavOpen(false)}>📞 Contact Us</Link>
        <Link to="/account" onClick={() => setMobileNavOpen(false)}>👤 My Account</Link>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
