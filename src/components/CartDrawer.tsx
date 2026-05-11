import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, total } = useCart();
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      toast('🔒 Please sign in first', { icon: '🔒' });
      setIsCartOpen(false);
      navigate('/login');
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeShipThreshold = 499;
  const remainingForFreeShip = freeShipThreshold - total;

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      ></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>🛒 Your Cart</h3>
          <span className="cart-close" onClick={() => setIsCartOpen(false)}>✕</span>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="emoji">🛍️</div>
              <p>Your cart is empty.<br/>Add some healthy products!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={`${item.id}-${item.variant_id}`} className="cart-item">
                <div className="cart-item-img"><img src={item.image} alt={item.name} /></div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-weight">{item.weight}</div>
                  <div className="cart-item-price">₹{item.price * item.qty}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.variant_id, -1)}>-</button>
                    <div className="qty-num">{item.qty}</div>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.variant_id, 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item-remove" style={{ border: 'none', background: 'transparent' }} onClick={() => removeFromCart(item.id, item.variant_id)}>🗑️</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <div>
                <span>Total</span>
                <div className="free-ship" style={{ color: remainingForFreeShip <= 0 ? 'var(--success)' : 'var(--text-light)', fontSize: '12px', marginTop: '4px' }}>
                  {remainingForFreeShip <= 0 
                    ? '🎉 Free Shipping Unlocked!' 
                    : `Add ₹${remainingForFreeShip} more for Free Shipping`}
                </div>
              </div>
              <span className="total-price">₹{total}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}
