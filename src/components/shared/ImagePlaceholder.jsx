({ label, aspectRatio = '16/9', minHeight = '200px' }) {
  return (
    <div
      className="image-placeholder-box"
      role="img"
      aria-label={`Image placeholder: ${label}`}
      style={{
        aspectRatio,
        minHeight,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px dashed #CBD5E1',
        borderRadius: '16px',
        backgroundColor: '#F8FAFC',
        color: '#94A3B8',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
      <p style={{
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 0,
        fontFamily: "'Nunito', sans-serif",
        color: '#64748B'
      }}>
        [Placeholder: {label}]
      </p>
    </div>
  );
}
