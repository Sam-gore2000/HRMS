function SidebarLink({ item, active, onSelect }) {
  return (
    <li className="nav-item">
      <button className={`nav-link ${active ? "active" : "collapsed"}`} onClick={() => onSelect(item.key)}>
        <i className={`bi ${item.icon}`} />
        <span>{item.label}</span>
      </button>
    </li>
  );
}

export function Sidebar({ items, page, setPage, collapsed, setCollapsed }) {
  return (
    <aside id="sidebar" className="sidebar">
      <div className="sidebar-logo">
        <button className="logo-button" onClick={() => setPage("dashboard")}>
          {/* Expanded: full logo (white on dark theme, black on light). Collapsed: the monogram. */}
          <img src="/img/hrm-white-logo.png" alt="LionReach Media" className="logo-full logo-on-dark" />
          <img src="/img/hrm-black-logo.png" alt="LionReach Media" className="logo-full logo-on-light" />
          <img src="/img/LRM_monogram.png" alt="LionReach Media" className="logo-icon" />
        </button>
        <i className="bi bi-chevron-double-left toggle-sidebar-btn" title="Toggle sidebar" onClick={() => setCollapsed(!collapsed)} />
      </div>
      <ul className="sidebar-nav" id="sidebar-nav">
        {items.map((item) => <SidebarLink key={item.key} item={item} active={page === item.key} onSelect={setPage} />)}
      </ul>
    </aside>
  );
}
