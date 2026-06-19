function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="page-section auth-page">
      <div className="container-xl auth-container">
        <div className="auth-card glass-card">
          {title && (
            <>
              <p className="section-label">HouseHunt</p>
              <h1 className="display-title auth-title">{title}</h1>
              {subtitle && <p className="auth-sub">{subtitle}</p>}
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
