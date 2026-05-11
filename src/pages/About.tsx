export default function About() {
  return (
    <div className="page active" id="page-about">
      <div className="about-hero">
        <h1>Our Story 🌿</h1>
        <p>Rooted in Tamil tradition, growing towards a healthier India. We are Ayngaran — your trusted partner in traditional wellness.</p>
      </div>
      
      <div className="about-story">
        <div className="about-story-text">
          <h2>From Grandmother's Kitchen to Your Doorstep</h2>
          <p>Ayngaran was born out of a simple belief: the best medicine is food, and the best food is traditional. Founded in the heart of Tamil Nadu, we started our journey by rediscovering and preserving the incredible nutritional wisdom embedded in our ancestors' cooking.</p>
          <p>Every product we make follows recipes passed down through generations. We use only the finest naturally grown ingredients sourced directly from trusted Tamil Nadu farmers.</p>
          <p>Our mission is to make traditional Tamil health foods accessible to every household.</p>
        </div>
        
        <div 
          className="about-visual" 
          style={{
            background: 'linear-gradient(135deg, var(--green-pale), var(--cream))',
            borderRadius: 'var(--radius-lg)',
            padding: '56px 48px',
            textAlign: 'center',
            border: '2px dashed var(--green-light)'
          }}
        >
          <div className="big-emoji" style={{ fontSize: '80px', marginBottom: '16px' }}>🌾</div>
          <h3 style={{ fontSize: '22px', color: 'var(--green-dark)' }}>50+ Traditional Products</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginTop: '12px', lineHeight: '1.6' }}>
            Each product carries centuries of Tamil culinary wisdom.
          </p>
        </div>
      </div>
      
      <section className="section" style={{ background: 'var(--cream)', paddingBottom: '0' }}>
        <div className="section-inner" style={{ paddingBottom: '56px' }}>
          <div className="section-header">
            <div className="section-tag">By the Numbers</div>
            <h2 className="section-title">Our <span>Impact</span></h2>
          </div>
          
          <div className="about-stats">
            <div className="about-stat-card">
              <div className="stat-icon" style={{ fontSize: '36px', marginBottom: '12px' }}>🏪</div>
              <div className="stat-num">50+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="about-stat-card">
              <div className="stat-icon" style={{ fontSize: '36px', marginBottom: '12px' }}>😊</div>
              <div className="stat-num">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="about-stat-card">
              <div className="stat-icon" style={{ fontSize: '36px', marginBottom: '12px' }}>🌾</div>
              <div className="stat-num">50+</div>
              <div className="stat-label">Partner Farmers</div>
            </div>
            <div className="about-stat-card">
              <div className="stat-icon" style={{ fontSize: '36px', marginBottom: '12px' }}>🏆</div>
              <div className="stat-num">FSSAI</div>
              <div className="stat-label">Certified</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
