import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import SkeletonProduct from '../../components/SkeletonProduct';
import client from '../../api/client';

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

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const categoryParam = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
    client.get(`/products${categoryParam}`)
      .then(res => {
        setProducts(res.data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryClick = (key: string) => {
    setSearchParams({ category: key });
  };

  const currentCategoryName = categories.find(c => c.key === activeCategory)?.name || 'all products';

  return (
    <div className="page active" id="page-products">
      <div className="page-hero">
        <h1>Our <span>Products</span></h1>
        <p>100% Natural Traditional Foods</p>
      </div>

      <div className="category-filter-bar">
        <div className="category-filter-inner">
          {categories.map(c => (
            <div 
              key={c.key}
              className={`filter-pill ${activeCategory === c.key ? 'active' : ''}`}
              onClick={() => handleCategoryClick(c.key)}
            >
              {c.emoji} {c.name}
            </div>
          ))}
        </div>
      </div>

      <div className="product-count-label">
        Showing <strong>{products.length}</strong> products in <strong>{currentCategoryName.toLowerCase()}</strong>
      </div>

      {loading ? (
        <div className="products-page-grid" id="productsPageGrid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonProduct key={i} />)}
        </div>
      ) : (
        <div className="products-page-grid" id="productsPageGrid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
