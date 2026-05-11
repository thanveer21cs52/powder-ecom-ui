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

  useEffect(() => {
    if (!id) return;
    setLoading(true);
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

  const thumbs = [product.main_image, product.main_image, product.main_image, product.main_image];
  const originalPriceCalc = selectedPrice ? Math.round(selectedPrice * 1.28) : 0;
  const discountPct = originalPriceCalc ? Math.round((1 - selectedPrice / originalPriceCalc) * 100) : 0;

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
          <div className="main-img" id="detailMainImg">
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
          <div className="product-detail-original">
            ₹{originalPriceCalc} <span className="off">{discountPct}% OFF</span>
          </div>
          
          <div className="product-detail-desc">{product.description}</div>
          
          {product.variants && product.variants.length > 0 && (
            <>
              <div className="detail-option-label">Select Quantity/Weight</div>
              <div className="weight-options">
                {product.variants.map((v: any) => {
                  const pPrice = Number(product.base_price) + Number(v.price_modifier);
                  return (
                    <button 
                      key={v.id}
                      className={`weight-btn ${selectedWeight === v.weight ? 'active' : ''}`}
                      onClick={() => handleWeightSelect(v.weight, v.price_modifier)}
                    >
                      {v.weight}
                      <span className="wb-price">₹{pPrice}</span>
                    </button>
                  );
                })}
              </div>
            </>
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
