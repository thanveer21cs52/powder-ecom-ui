import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" onClick={() => navigate('/')} style={{ marginBottom: '8px', cursor: 'pointer' }}>
              <img src="https://image.qwenlm.ai/public_source/5e7fe444-e1ce-4ec2-aaeb-0a37d63f249f/1b39b99a2-a6b2-4ae5-9bb8-150dabb6bdf6.png" alt="Ayngaran" style={{ height: '40px' }}/>
            </div>
            <p>Bringing the wisdom of Tamil traditional foods to modern healthy living. 100% natural, no preservatives, homemade quality.</p>
            <div className="footer-social">
              <div className="social-icon">📘</div>
              <div className="social-icon">📸</div>
              <div className="social-icon">▶️</div>
              <div className="social-icon">💬</div>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/shop">Our Products</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          
          <div className="footer-col">
            <h4>Help</h4>
            <a>Shipping Policy</a>
            <a>Return Policy</a>
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
            <a>Track Your Order</a>
            <a>FAQ</a>
          </div>
          
          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Subscribe for exclusive offers and new product alerts!</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email"/>
              <button onClick={() => toast.success('✅ Subscribed!')}>Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>© 2026 Ayngaran. All rights reserved.</span>
          <span>Made with 💚 in Tamil Nadu, India</span>
          <span>🔒 Secure Shopping</span>
        </div>
      </div>
    </footer>
  );
}
