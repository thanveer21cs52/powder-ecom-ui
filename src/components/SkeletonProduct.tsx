export default function SkeletonProduct() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="skeleton-card-body">
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton skeleton-text title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <div className="skeleton skeleton-text" style={{ flex: 1, height: '36px', borderRadius: '4px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '36px', height: '36px', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  );
}
