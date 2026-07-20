import '../../css/PageHeader.css';

export default function PageHeader({ subtitle, title, description, action, children }) {
    return (
        <section className="page-header">
            <div className="page-header-content">
                {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
                {title && <h1>{title}</h1>}
                {description && <p className="page-header-description">{description}</p>}
                {children}
            </div>
            {action && (
                <div className="page-header-action">
                    {action}
                </div>
            )}
        </section>
    );
}
