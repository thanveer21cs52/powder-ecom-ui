import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [loading, setLoading] = useState(false);
  
  const [address, setAddress] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    street: '',
    city: '',
    state: '',
    pin: '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  if (!user) {
    return (
      <div className="page active" id="page-checkout" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Please log in to proceed to checkout.</h2>
        <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page active" id="page-checkout" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Your cart is empty.</h2>
        <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/shop')}>Continue Shopping</button>
      </div>
    );
  }

  const shipping = total >= 499 ? 0 : 49;
  const tax = Math.round(total * 0.05); // 5% GST
  const grandTotal = total + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!address.firstName || !address.phone || !address.street || !address.pin) {
      toast.error('Please fill all required address fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cart,
        address,
        total: grandTotal,
        paymentMethod
      };
      const res = await client.post('/orders', payload);
      if (res.data.success) {
        clearCart();
        toast.success('🎉 Purchase Successful!', { duration: 5000 });
        // Pass order ID via state to OrderSuccess
        navigate('/order-success', { state: { orderId: res.data.orderId } });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="page-checkout">
      <div className="checkout-layout">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>Secure Checkout</h2>
          
          <div className="checkout-section">
            <h3>Contact Information</h3>
            <div className="form-group"><label>Email Address</label><input type="email" placeholder="your@email.com" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} /></div>
            <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="+91" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} /></div>
          </div>

          <div className="checkout-section">
            <h3>Shipping Address</h3>
            <div className="form-row">
              <div className="form-group"><label>First Name</label><input type="text" placeholder="First Name" value={address.firstName} onChange={e => setAddress({...address, firstName: e.target.value})} /></div>
              <div className="form-group"><label>Last Name</label><input type="text" placeholder="Last Name" value={address.lastName} onChange={e => setAddress({...address, lastName: e.target.value})} /></div>
            </div>
            <div className="form-group"><label>Street Address</label><input type="text" placeholder="123 Healthy Street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label>City</label><input type="text" placeholder="Chennai" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} /></div>
              <div className="form-group"><label>State</label><input type="text" placeholder="Tamil Nadu" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} /></div>
              <div className="form-group"><label>Pincode</label><input type="text" placeholder="600001" value={address.pin} onChange={e => setAddress({...address, pin: e.target.value})} /></div>
            </div>
          </div>

          <div className="checkout-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} readOnly />
                <span className="pay-icon">💳</span>
                <div className="pay-info"><div className="pay-name">Credit/Debit Card</div><div className="pay-desc">Secure encrypted payment</div></div>
              </label>
              <label className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`} onClick={() => setPaymentMethod('upi')}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} readOnly />
                <span className="pay-icon">📱</span>
                <div className="pay-info"><div className="pay-name">UPI / GPay</div><div className="pay-desc">Instant transfer via UPI apps</div></div>
              </label>
              <label className={`payment-option ${paymentMethod === 'netbanking' ? 'active' : ''}`} onClick={() => setPaymentMethod('netbanking')}>
                <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} readOnly />
                <span className="pay-icon">🏦</span>
                <div className="pay-info"><div className="pay-name">Net Banking</div><div className="pay-desc">All major banks supported</div></div>
              </label>
              <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} readOnly />
                <span className="pay-icon">💵</span>
                <div className="pay-info"><div className="pay-name">Cash on Delivery</div><div className="pay-desc">Pay when you receive</div></div>
              </label>
            </div>

            {paymentMethod === 'upi' && (
              <div style={{ marginTop: '16px' }}>
                <div className="form-group"><label>UPI ID</label><input type="text" placeholder="yourname@upi" /></div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div style={{ marginTop: '16px' }}>
                <div className="form-group"><label>Card Number</label><input type="text" placeholder="1234 5678 9012 3456" maxLength={19} /></div>
                <div className="form-row">
                  <div className="form-group"><label>Expiry</label><input type="text" placeholder="MM/YY" maxLength={5} /></div>
                  <div className="form-group"><label>CVV</label><input type="password" placeholder="•••" maxLength={4} /></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="checkout-section" style={{ position: 'sticky', top: '100px' }}>
            <h3>Order Summary</h3>
            <div style={{ marginBottom: '24px' }}>
              {cart.map(item => (
                <div key={`${item.id}-${item.variant_id}`} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.weight} × {item.qty}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green-dark)', marginTop: '4px' }}>₹{item.price * item.qty}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div className="order-total-row"><span className="label">Subtotal</span><span>₹{total}</span></div>
              <div className="order-total-row"><span className="label">Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
              <div className="order-total-row"><span className="label">Tax (GST 5%)</span><span>₹{tax}</span></div>
              <div className="order-total-row grand"><span>Total</span><span>₹{grandTotal}</span></div>
            </div>
            
            <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading} style={{ width: '100%', marginTop: '24px' }}>
              {loading ? 'Processing...' : '🔒 Place Order'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-light)', marginTop: '12px' }}>🔒 Your payment info is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
