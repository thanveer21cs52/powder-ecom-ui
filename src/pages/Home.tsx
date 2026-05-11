import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonProduct from '../components/SkeletonProduct';
import client from '../api/client';

// Keep the hardcoded categories for exact match, or fetch them
const categories = [
  { name:'All', emoji:'🌿', key:'all' },
  { name:'Podi', emoji:'🌶️', key:'podi' },
  { name:'Malt', emoji:'🥛', key:'malt' },
  { name:'Powder', emoji:'🍵', key:'powder' },
  { name:'Masala', emoji:'🍛', key:'masala' },
  { name:'Soup', emoji:'🍲', key:'soup' },
  { name:'Skin Care', emoji:'💆', key:'skincare' },
  { name:'Others', emoji:'📦', key:'others' }
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products
    setLoading(true);
    client.get('/products')
      .then(res => {
        // Take first 8 products for home page to simulate 'featured'
        if (res.data && res.data.products) {
          setProducts(res.data.products.slice(0, 8));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page active" id="page-home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">🌾 Traditional Tamil Recipes</div>
            <h1>Natural & Healthy<br/><span>Traditional Foods</span></h1>
            <p>Discover the power of ancient recipes crafted with love. 100% natural, no preservatives — from our kitchen to yours.</p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => navigate('/shop')}>Shop Now →</button>
              <button className="btn-outline" onClick={() => navigate('/about')}>Our Story</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="num">50+</div><div className="label">Products</div></div>
              <div className="hero-stat"><div className="num">10K+</div><div className="label">Happy Customers</div></div>
              <div className="hero-stat"><div className="num">100%</div><div className="label">Natural</div></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-container">
              <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop" alt="Traditional Spices"/>
              <div className="hero-badge-float">BEST<br/>SELLER</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section categories-strip">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Browse Categories</div>
            <h2 className="section-title">Our <span>Collections</span></h2>
            <p className="section-subtitle">Explore our carefully curated range of traditional healthy foods</p>
          </div>
          <div className="categories-grid">
            {categories.slice(1).map(c => (
              <div key={c.key} className="category-card" onClick={() => navigate(`/shop?category=${c.key}`)}>
                <div className="category-emoji">{c.emoji}</div>
                <div className="category-name">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Popular Picks</div>
            <h2 className="section-title">Trending <span>Products</span></h2>
            <p className="section-subtitle">Our most loved natural products, chosen by thousands of healthy families</p>
          </div>
          <div className="products-grid">
            {loading ? (
              <>
                <SkeletonProduct />
                <SkeletonProduct />
                <SkeletonProduct />
                <SkeletonProduct />
              </>
            ) : (
              products.map((p, idx) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  isHot={idx === 0} 
                  isSale={idx === 1} 
                />
              ))
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn-outline" style={{ color: 'var(--green-dark)', borderColor: 'var(--border)' }} onClick={() => navigate('/shop')}>
              View All Products →
            </button>
          </div>
        </div>
      </section>

      <section className="section why-us">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">The Ayngaran Promise</div>
            <h2 className="section-title">Why Choose Us?</h2>
            <p className="section-subtitle">We believe in bringing back the wisdom of our ancestors through pure, unadulterated food.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🌿</div>
              <h3 className="why-title">100% Natural</h3>
              <p className="why-desc">No artificial colors, flavors or preservatives. Just pure nature.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">👵</div>
              <h3 className="why-title">Traditional Recipe</h3>
              <p className="why-desc">Authentic preparation methods passed down through generations.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">💪</div>
              <h3 className="why-title">Health First</h3>
              <p className="why-desc">Focused on immunity, gut health and overall well-being.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">✨</div>
              <h3 className="why-title">Premium Quality</h3>
              <p className="why-desc">Sourced from the finest organic farms across South India.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Reviews</div>
            <h2 className="section-title">What Our <span>Family Says</span></h2>
            <p className="section-subtitle">Real experiences from people who made the healthy switch</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"The Moringa Podi has become a daily staple in my family. I can actually feel the difference in my energy levels. Tastes incredibly authentic!"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">👨</div>
                <div>
                  <div className="testimonial-name">Rajesh Kumar</div>
                  <div className="testimonial-loc">Chennai, TN</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"I started giving U-Malt to my kids instead of those sugar-loaded health drinks. They love the taste and I love the ingredients."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">👩</div>
                <div>
                  <div className="testimonial-name">Priya S.</div>
                  <div className="testimonial-loc">Bangalore, KA</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"The Karuveppilai Podi reminds me of my grandmother's cooking. Perfect mix of spices and curry leaves. Highly recommended!"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">👱</div>
                <div>
                  <div className="testimonial-name">Karthik R.</div>
                  <div className="testimonial-loc">Coimbatore, TN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE SUB (only for layout matching, logic handled via component or global state) */}
      {/* Footer is global so we don't put it here */}
    </div>
  );
}
