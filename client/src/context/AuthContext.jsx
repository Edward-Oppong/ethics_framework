// ============================================================
//  Auth Context — simple localStorage-based authentication
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_KEY = 'ec_auth_v1';

function loadUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const login = (email, password) => {
    if ((email === 'demo@ethics.ai' || email === 'demo') && (password === 'demo123' || password === 'demo')) {
      const u = { name: 'Dr. Alex Vance', email: 'demo@ethics.ai', role: 'Lead Ethicist' };
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
      setUser(u);
      return u;
    }
    const accounts = JSON.parse(localStorage.getItem('ec_accounts_v1') || '[]');
    const found = accounts.find(a => a.email === email && a.password === password);
    if (!found) throw new Error('Invalid email or password.');
    const u = { name: found.name, email: found.email, role: found.role || 'Scholar' };
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = (name, email, password, role) => {
    const accounts = JSON.parse(localStorage.getItem('ec_accounts_v1') || '[]');
    if (accounts.find(a => a.email === email)) throw new Error('An account with this email already exists.');
    const newAccount = { name, email, password, role: role || 'Scholar' };
    accounts.push(newAccount);
    localStorage.setItem('ec_accounts_v1', JSON.stringify(accounts));
    const u = { name, email, role: role || 'Scholar' };
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
