import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  original_price: number;
  discount_pct: number;
  main_image: string;
  category_id?: number;
  category_name?: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  isHot?: boolean;
  isSale?: boolean;
}

export default function ProductCard({ product, isHot, isSale }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to a weight for now, or assume backend base price matches a default weight
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.base_price),
      qty: 1,
      weight: '50g',
      image: product.main_image
    });
    toast.success(`✅ ${product.name} (50g) added!`);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast('Please login to use wishlist', { icon: '🔒' });
        return;
      }
      const client = (await import('../api/client')).default;
      
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
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-img">
        <img src={product.main_image} alt={product.name} />
        {isHot && <div className="product-tag hot">HOT</div>}
        {isSale && <div className="product-tag sale">SALE</div>}
        <div className="product-wishlist" onClick={handleWishlist}>{isLiked ? '❤️' : '♡'}</div>
      </div>
      <div className="product-info">
        <div className="product-category">{product.category_name || 'Category'}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-pricing">
          <span className="product-price">₹{product.base_price}</span>
          {product.original_price > product.base_price && (
            <>
              <span className="product-original">₹{product.original_price}</span>
              <span className="product-discount">{product.discount_pct}% OFF</span>
            </>
          )}
        </div>
        <div className="product-rating">
          <span className="stars">★★★★★</span>
          <span>{product.rating || '4.9'}</span>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}
