export default function SkeletonDetail() {
  return (
    <div className="product-detail-inner">
      <div className="pd-gallery">
        <div className="skeleton skeleton-img" style={{ height: '400px', borderRadius: '12px' }}></div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '8px' }}></div>
          ))}
        </div>
      </div>
      <div className="pd-info">
        <div className="skeleton skeleton-text" style={{ width: '100px', height: '24px', borderRadius: '20px', marginBottom: '16px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '32px', marginBottom: '16px', width: '80%' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '14px', marginBottom: '8px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '14px', marginBottom: '8px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '14px', marginBottom: '24px', width: '60%' }}></div>
        
        <div className="skeleton skeleton-text" style={{ height: '28px', width: '120px', marginBottom: '24px' }}></div>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ width: '60px', height: '36px', borderRadius: '4px' }}></div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="skeleton" style={{ flex: 1, height: '48px', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ width: '60px', height: '48px', borderRadius: '8px' }}></div>
        </div>
      </div>
    </div>
  );
}
