import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import SkeletonProduct from '../../components/SkeletonProduct';
import client from '../../api/client';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([
    { name:'All', emoji:'🌿', key:'all' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    client.get('/categories')
      .then(res => {
        if (res.data && res.data.categories) {
          const list = res.data.categories.map((c: any) => ({
            name: c.name,
            emoji: c.emoji,
            key: c.slug
          }));
          setCategories([
            { name:'All', emoji:'🌿', key:'all' },
            ...list
          ]);
        }
      })
      .catch(console.error);
  }, []);

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
