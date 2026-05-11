import React from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
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
                <input type="text" placeholder="Priya" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Suresh" required />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="priya@example.com" required />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+91 98765 43210" required />
            </div>
            
            <div className="form-group">
              <label>Subject</label>
              <select required>
                <option>Product Inquiry</option>
                <option>Order Support</option>
                <option>Bulk Order</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Tell us how we can help…" rows={5} required></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
