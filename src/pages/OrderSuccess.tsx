import { useNavigate, useLocation } from 'react-router-dom';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || `AYN${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="page active" id="page-order-success">
      <div className="order-success" style={{ textAlign: 'center', padding: '100px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <div className="success-icon" style={{ fontSize: '72px', marginBottom: '24px' }}>✅</div>
        <h2 style={{ fontSize: '32px', color: 'var(--green-dark)', marginBottom: '16px' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-mid)', fontSize: '16px', marginBottom: '24px' }}>Thank you for shopping with Ayngaran.</p>
        
        <div className="order-id-display" style={{ background: 'var(--green-pale)', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '16px', display: 'inline-block' }}>
          Order ID: #{orderId}
        </div>
        
        <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '32px' }}>You will receive a confirmation email shortly.</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/account')}>Track Order</button>
          <button className="btn-outline" style={{ color: 'var(--green-dark)', borderColor: 'var(--green-dark)' }} onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}
