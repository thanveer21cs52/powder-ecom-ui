import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      client.get(`/products?search=${query}`)
        .then(res => setResults(res.data.products || []))
        .catch(console.error);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-modal open" onClick={onClose}>
      <div className="search-modal-content" onClick={e => e.stopPropagation()}>
        <input 
          type="text" 
          className="search-modal-input" 
          placeholder="Search products..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
          autoFocus
        />
        {results.length > 0 && (
          <div className="search-results">
            {results.map(p => (
              <div 
                key={p.id} 
                className="search-result-item" 
                onClick={() => {
                  navigate(`/product/${p.id}`);
                  onClose();
                }}
              >
                <img src={p.main_image} alt={p.name} />
                <div>
                  <div className="sr-name">{p.name}</div>
                  <div className="sr-price">₹{p.base_price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
