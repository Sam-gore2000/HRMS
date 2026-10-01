import { useNow } from "../../hooks/useNow.js";
import { Greeting } from "./header/Greeting.jsx";
import { LiveClock } from "./header/LiveClock.jsx";
import { LogoutButton } from "./header/LogoutButton.jsx";
import { NotificationBell } from "./header/NotificationBell.jsx";
import { ThemeToggle } from "./header/ThemeToggle.jsx";

export function Header({ user, onLogout, onToggleTheme }) {
  const now = useNow();
  return (
    <header id="header" className="header">
      <Greeting user={user} now={now} />
      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <LiveClock now={now} />
          <ThemeToggle onToggle={onToggleTheme} />
          <NotificationBell />
          <LogoutButton onLogout={onLogout} />
        </ul>
      </nav>
    </header>
  );
}
