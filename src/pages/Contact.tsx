import React, { useState } from 'react';
import toast from 'react-hot-toast';
import client from '../api/client';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'Product Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      };
      await client.post('/contacts', payload);
      toast.success('Message sent successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'Product Inquiry',
        message: ''
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="page-contact">
      <div className="page-hero">
        <h1>📞 Contact Us</h1>
        <p>We'd love to hear from you!</p>
      </div>
      
      <div className="contact-inner">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have questions about our products, bulk orders, or partnerships?</p>
          
          <div className="contact-detail">
            <div className="icon">📍</div>
            <div>
              <div className="label">Address</div>
              <div className="value">No. 12, Kamaraj Nagar, Coimbatore – 641001, Tamil Nadu</div>
            </div>
          </div>
          
          <div className="contact-detail">
            <div className="icon">📞</div>
            <div>
              <div className="label">Phone</div>
              <div className="value">+91 98765 43210</div>
            </div>
          </div>
          
          <div className="contact-detail">
            <div className="icon">📧</div>
            <div>
              <div className="label">Email</div>
              <div className="value">hello@ayngaran.com</div>
            </div>
          </div>
          
          <div className="contact-detail">
            <div className="icon">🕐</div>
            <div>
              <div className="label">Hours</div>
              <div className="value">Mon–Sat: 9AM–7PM<br/>Sunday: 10AM–5PM</div>
            </div>
          </div>
        </div>
        
        <div className="contact-form">
          <h3>Send a Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  placeholder="Priya" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  placeholder="Suresh" 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="priya@example.com" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                placeholder="+91 98765 43210" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Subject</label>
              <select 
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                required
              >
                <option>Product Inquiry</option>
                <option>Order Support</option>
                <option>Bulk Order</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea 
                placeholder="Tell us how we can help…" 
                rows={5} 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
