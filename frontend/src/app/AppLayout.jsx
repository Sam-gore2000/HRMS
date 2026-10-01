import { useEffect, useMemo, useState } from "react";
import { Footer } from "../components/layout/Footer.jsx";
import { Header } from "../components/layout/Header.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { useSidebar } from "../hooks/useSidebar.js";
import { DEFAULT_PAGE } from "../modules/registry.js";
import { navForRole } from "../navigation/index.js";
import { PageRouter } from "./PageRouter.jsx";

// Signed-in shell: sidebar + header + current page + footer.
export function AppLayout({ user, onLogout, onToggleTheme }) {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [collapsed, setCollapsed] = useSidebar();

  const navItems = navForRole(user.role);
  const allowedPages = useMemo(() => new Set(navItems.map((item) => item.key)), [navItems]);
  useEffect(() => { if (!allowedPages.has(page)) setPage(DEFAULT_PAGE); }, [allowedPages, page]);

  return (
    <div className="app-layout">
      <Sidebar items={navItems} page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-wrapper">
        <Header user={user} onLogout={onLogout} onToggleTheme={onToggleTheme} />
        <main id="main" className="main"><PageRouter page={page} user={user} /></main>
        <Footer />
      </div>
    </div>
  );
}
