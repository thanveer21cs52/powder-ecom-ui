import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const term = query.trim();

    if (term.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);

    client
      .get(`/products?search=${encodeURIComponent(term)}`)
      .then(res => {
        if (requestId !== requestIdRef.current) return;
        setResults(res.data.products || []);
      })
      .catch(err => {
        if (requestId !== requestIdRef.current) return;
        console.error(err);
        setResults([]);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-modal open" onClick={onClose}>
      <div className="search-modal-content" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <input
            type="text"
            className="search-modal-input"
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
            }}
            autoFocus
            inputMode="search"
          />
          <button className="search-modal-close" type="button" onClick={onClose} aria-label="Close search">
            ×
          </button>
        </div>

        <div className="search-modal-body">
          {loading ? (
            <div className="search-loading-state">
              <div className="search-loading-spinner" />
              <span>Searching products...</span>
            </div>
          ) : results.length > 0 ? (
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
          ) : query.trim().length > 0 ? (
            <div className="search-empty-state">No products found for "{query}"</div>
          ) : (
            <div className="search-empty-state">Start typing to find products</div>
          )}
        </div>
      </div>
    </div>
  );
}
