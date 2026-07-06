import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-line flex items-center gap-4 px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-ink-600 hover:text-ink-900"
        aria-label="Open menu"
      >
        <Menu className="w-5.5 h-5.5" />
      </button>

      <div className="relative hidden sm:block flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          placeholder="Search patients, doctors, records…"
          className="w-full rounded-lg border border-line bg-surface pl-9 pr-3 py-2 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          className="relative p-2 rounded-lg text-ink-600 hover:bg-surface"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger-600" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-surface"
          >
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-medium text-sm">
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-sm font-medium text-ink-900">{user?.name ?? 'Admin User'}</p>
              <p className="text-xs text-ink-600">{user?.role ?? 'Administrator'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-ink-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-line shadow-lg z-20 py-1">
                <button className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-ink-900 hover:bg-surface">
                  <User className="w-4 h-4" /> My Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-danger-600 hover:bg-danger-50"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
