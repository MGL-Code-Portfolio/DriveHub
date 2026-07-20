import '../../css/Avatar.css';

export default function Avatar({ src, alt, size = 'md' }) {
    const sizeMap = {
        xs: 28,
        sm: 36,
        md: 48,
        lg: 64,
        xl: 100,
        profile: 160,
    };

    const px = sizeMap[size] || sizeMap.md;

    return (
        <div className="avatar-wrapper" style={{ width: px, height: px }}>
            {src ? (
                <img src={src} alt={alt || ''} className="avatar-img" />
            ) : (
                <div className="avatar-placeholder">
                    <i className="bi bi-person-fill"></i>
                </div>
            )}
        </div>
    );
}
