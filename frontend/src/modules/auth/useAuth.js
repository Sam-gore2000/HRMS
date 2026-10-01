import { useEffect, useState } from "react";
import { authApi } from "./authApi.js";

const USER_KEY = "hrms_user";

function readStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Signed-in user, persisted across reloads.
export function useAuth() {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return { user, login: setUser, logout };
}
