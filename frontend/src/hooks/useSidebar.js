import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 991;

// Sidebar collapsed state, reflected as a class on <body> for the legacy CSS.
export function useSidebar() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  useEffect(() => { document.body.classList.toggle("sidebar-collapsed", collapsed); }, [collapsed]);
  return [collapsed, setCollapsed];
}
