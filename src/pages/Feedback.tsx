import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

export default function Feedback() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  // Autofill name and email if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        rating,
        message: formData.message
      };

      await client.post('/feedbacks', payload);
      toast.success('Thank you! Feedback submitted successfully.');
      
      // Reset form (keep name/email if logged in)
      setFormData(prev => ({
        name: user ? user.name || '' : '',
        email: user ? user.email || '' : '',
        message: ''
      }));
      setRating(5);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="page-feedback">
      <div className="page-hero">
        <h1>💬 Customer <span>Feedback</span></h1>
        <p>Your thoughts help us improve and serve you better</p>
      </div>

      <div className="auth-page" style={{ background: 'var(--cream)', minHeight: 'auto', padding: '60px 24px' }}>
        <div className="auth-container" style={{ maxWidth: '560px', borderRadius: 'var(--radius-md)' }}>
          <h2>Share Your Experience</h2>
          <p className="auth-subtitle">We value your honest opinion about our products and service</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Priya Suresh" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required 
                disabled={!!user}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="priya@example.com" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required 
                disabled={!!user}
              />
            </div>

            <div className="form-group">
              <label>Rating</label>
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                {[1, 2, 3, 4, 5].map((index) => {
                  const filled = index <= (hover || rating);
                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHover(index)}
                      onMouseLeave={() => setHover(0)}
                      style={{ cursor: 'pointer', transition: 'transform 0.1s ease' }}
                      className="star-btn"
                    >
                      <Star 
                        size={32} 
                        fill={filled ? 'var(--yellow)' : 'transparent'} 
                        color={filled ? 'var(--yellow)' : 'var(--text-light)'} 
                        style={{ transform: hover === index ? 'scale(1.15)' : 'scale(1)' }}
                      />
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-mid)', fontWeight: 500 }}>
                {rating === 5 && '😍 Excellent - Love it!'}
                {rating === 4 && '😊 Good - Satisfied'}
                {rating === 3 && '😐 Average - Can be better'}
                {rating === 2 && '🙁 Poor - Disappointed'}
                {rating === 1 && '😡 Very Poor - Terrible'}
              </span>
            </div>

            <div className="form-group">
              <label>Your Feedback</label>
              <textarea 
                placeholder="Write your suggestions, review or experience here..." 
                rows={5} 
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            <button type="submit" className="auth-btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
