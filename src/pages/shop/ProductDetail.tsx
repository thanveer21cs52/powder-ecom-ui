import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import SkeletonDetail from '../../components/SkeletonDetail';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeThumb, setActiveThumb] = useState<string>('');
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [qty, setQty] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [hoverIntervalId, setHoverIntervalId] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const handleMouseEnter = () => {
    if (!product) return;
    const allImages = [product.main_image, ...(product.image_links || [])].filter(Boolean);
    if (allImages.length <= 1) return;
    
    let currentIndex = allImages.indexOf(activeThumb);
    if (currentIndex === -1) currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % allImages.length;
      setActiveThumb(allImages[currentIndex]);
    }, 1200);
    
    setHoverIntervalId(interval);
  };

  const handleMouseLeave = () => {
    if (hoverIntervalId) {
      clearInterval(hoverIntervalId);
      setHoverIntervalId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverIntervalId) clearInterval(hoverIntervalId);
    };
  }, [hoverIntervalId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (reviewRating < 1 || reviewRating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }
    setSubmittingReview(true);
    try {
      await client.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success('Thank you! Your review has been submitted.');
      setReviewComment('');
      setReviewRating(5);
      
      // Re-fetch reviews
      client.get(`/reviews/${product.id}`)
        .then(revRes => {
          setReviews(revRes.data.reviews || []);
        })
        .catch(console.error);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setLoadingReviews(true);
    client.get(`/products/${id}`)
      .then(res => {
        const p = res.data.product;
        setProduct(p);
        setActiveThumb(p.main_image);
        if (p.variants && p.variants.length > 0) {
          const firstVar = p.variants[0];
          setSelectedWeight(firstVar.weight);
          setSelectedPrice(Number(p.base_price) + Number(firstVar.price_modifier));
        } else {
          setSelectedPrice(Number(p.base_price));
        }

        // Fetch related
        client.get(`/products?category=${p.category_slug}`)
          .then(relRes => {
            setRelated(relRes.data.products.filter((rp: any) => rp.id !== p.id).slice(0, 4));
          })
          .catch(console.error);
          
        // Fetch reviews
        client.get(`/reviews/${p.id}`)
          .then(revRes => {
            setReviews(revRes.data.reviews || []);
          })
          .catch(console.error)
          .finally(() => setLoadingReviews(false));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonDetail />;
  if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Product not found.</div>;

  const handleWeightSelect = (weight: string, modifier: number) => {
    setSelectedWeight(weight);
    setSelectedPrice(Number(product.base_price) + Number(modifier));
  };

  const handleAddCart = () => {
    const variantId = product.variants?.find((v: any) => v.weight === selectedWeight)?.id;
    addToCart({
      id: product.id,
      variant_id: variantId,
      name: product.name,
      price: selectedPrice,
      qty: qty,
      weight: selectedWeight || 'default',
      image: product.main_image
    });
    toast.success(`✅ ${product.name} (${selectedWeight}) added!`);
  };

  const thumbs = [product.main_image, ...(product.image_links || [])].filter(Boolean);
  
  const productDiscountPct = Number(product.discount_pct) || 0;
  const productOriginalPrice = product.original_price && Number(product.original_price) > Number(product.base_price)
    ? Number(product.original_price) + (selectedPrice - Number(product.base_price))
    : 0;
  const discountPct = productDiscountPct;

  return (
    <div className="page active" id="page-detail">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> &gt;{' '}
        <span onClick={() => navigate('/shop')}>Products</span> &gt;{' '}
        <span onClick={() => navigate(`/shop?category=${product.category_slug}`)}>{product.category_name}</span> &gt;{' '}
        <span>{product.name}</span>
      </div>

      <div className="product-detail-inner">
        <div className="product-gallery">
          <div 
            className="main-img" 
            id="detailMainImg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'zoom-in', position: 'relative' }}
          >
            <img src={activeThumb} alt={product.name} />
          </div>
          <div className="product-thumbs" id="detailThumbs">
            {thumbs.map((img, i) => (
              <div 
                key={i} 
                className={`thumb ${activeThumb === img ? 'active' : ''}`}
                onClick={() => setActiveThumb(img)}
              >
                <img src={img} alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info-col">
          <div className="product-detail-badge">🌿 100% Natural</div>
          <h1 className="product-detail-name">{product.name}</h1>
          
          <div className="product-detail-rating">
            <span className="stars">★★★★★</span>
            <span>{product.rating || '4.9'} ({product.review_count || 128} reviews)</span>
          </div>
          
          <div className="product-detail-price">₹{selectedPrice}</div>
          {discountPct > 0 && productOriginalPrice > 0 && (
            <div className="product-detail-original">
              ₹{productOriginalPrice} <span className="off">{discountPct}% OFF</span>
            </div>
          )}
          
          <div className="product-detail-desc">{product.description}</div>
          
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="detail-option-label" style={{ marginBottom: '8px', fontWeight: 600 }}>Select Weight / Quantity</div>
              <select
                value={selectedWeight}
                onChange={(e) => {
                  const val = e.target.value;
                  const variant = product.variants.find((v: any) => v.weight === val);
                  if (variant) {
                    handleWeightSelect(variant.weight, variant.price_modifier);
                  }
                }}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  padding: '12px 16px',
                  border: '1.5px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--white)',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'var(--text-dark)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {product.variants.map((v: any) => {
                  const pPrice = Number(product.base_price) + Number(v.price_modifier);
                  return (
                    <option key={v.id} value={v.weight}>
                      {v.weight} (₹{pPrice})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="detail-option-label">Number of Items</div>
          <div className="qty-selector">
            <button className="qty-btn-lg" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <div className="qty-display">{qty}</div>
            <button className="qty-btn-lg" onClick={() => setQty(qty + 1)}>+</button>
          </div>
          
          <div className="detail-actions">
            <button className="btn-add-cart" onClick={handleAddCart}>🛒 Add to Cart</button>
            <button className="btn-wishlist" onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                if (!token) { toast('Please login', { icon: '🔒' }); return; }
                const client = (await import('../../api/client')).default;
                
                if (isLiked) {
                  await client.delete(`/wishlist/${product.id}`);
                  setIsLiked(false);
                  toast('Removed from wishlist');
                } else {
                  await client.post('/wishlist', { productId: product.id });
                  setIsLiked(true);
                  toast('❤️ Added to wishlist!', { icon: '❤️' });
                }
              } catch (err) {
                toast.error('Could not update wishlist');
              }
            }}>{isLiked ? '❤️' : '♡'}</button>
          </div>
          
          <div className="product-features">
            <div className="feature-item">🌾 Traditional Recipe</div>
            <div className="feature-item">🚫 No Preservatives</div>
            <div className="feature-item">💯 Premium Quality</div>
            <div className="feature-item">🌱 Pure & Natural</div>
          </div>
        </div>
      </div>

      <div className="product-reviews-section section-inner" style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Customer <span>Reviews</span></h2>
        
        {/* Write Review Form */}
        <div style={{ background: 'var(--cream)', borderRadius: '16px', padding: '24px', marginBottom: '40px', border: '1.5px solid var(--border)' }}>
          {isLoggedIn ? (
            <form onSubmit={handleReviewSubmit}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '12px' }}>Leave a Review</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '28px',
                        color: star <= reviewRating ? 'var(--yellow)' : 'var(--border)',
                        padding: 0,
                        marginRight: '4px',
                        outline: 'none'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>Comment</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border)',
                    fontSize: '14px',
                    background: 'var(--white)',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                style={{
                  background: 'var(--green-dark)',
                  color: 'var(--white)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginBottom: '12px' }}>Please log in to write a review for this product.</p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'var(--green-mid)',
                  color: 'var(--white)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Log In
              </button>
            </div>
          )}
        </div>

        {loadingReviews ? (
          <div className="skeleton" style={{ height: '100px', width: '100%', borderRadius: '12px' }}></div>
        ) : reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((rev: any) => (
              <div key={rev.id} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700 }}>{rev.user_name}</span>
                  <span style={{ color: 'var(--green-dark)', fontWeight: 600 }}>{rev.rating} ⭐</span>
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '14px', lineHeight: '1.6' }}>{rev.comment}</p>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '12px' }}>
                  {new Date(rev.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', background: 'var(--cream)', borderRadius: '16px', textAlign: 'center', color: 'var(--text-mid)' }}>
            No reviews yet for this product. Be the first to share your experience!
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--cream)' }}>
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">Similar <span>Products</span></h2>
            </div>
            <div className="products-grid">
              {related.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
