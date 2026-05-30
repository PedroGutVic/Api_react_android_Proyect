export const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton skeleton-banner" />
        <div className="skeleton-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton skeleton-badge" />
                <div className="skeleton skeleton-icon" />
            </div>
            <div className="skeleton skeleton-line" style={{ width: '85%' }} />
            <div className="skeleton skeleton-line" style={{ width: '65%' }} />
            <div className="skeleton skeleton-line" style={{ width: '45%', marginTop: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div className="skeleton skeleton-line" style={{ width: '30%' }} />
                <div className="skeleton skeleton-line" style={{ width: '20%' }} />
            </div>
        </div>
    </div>
);

export const SkeletonRow = () => (
    <div className="skeleton-row">
        <div className="skeleton skeleton-thumb" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="skeleton skeleton-line" style={{ width: '50%' }} />
            <div className="skeleton skeleton-badge" />
        </div>
        <div className="skeleton skeleton-line" style={{ width: 90 }} />
        <div className="skeleton skeleton-line" style={{ width: 50 }} />
        <div className="skeleton skeleton-line" style={{ width: 60 }} />
    </div>
);

export const SkeletonUserCard = () => (
    <div className="skeleton-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton skeleton-badge" />
        </div>
        <div className="skeleton skeleton-line" style={{ width: '60%', height: 20, marginBottom: 8 }} />
        <div className="skeleton skeleton-line" style={{ width: '80%' }} />
        <div className="skeleton skeleton-badge" style={{ marginTop: 10 }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <div className="skeleton skeleton-btn" />
            <div className="skeleton skeleton-btn" />
        </div>
    </div>
);
