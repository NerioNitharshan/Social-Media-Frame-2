import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/hooks/useAuth';
import { 
  LayoutGrid, 
  Upload, 
  Settings, 
  Users, 
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-green-100 text-green-800'
          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/admin" className="text-xl font-bold text-green-800">
                CMS Admin
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                  <span>{user?.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 w-48 mt-2 py-1 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              <NavItem
                to="/admin"
                icon={<LayoutGrid className="w-5 h-5" />}
                label="Dashboard"
                active={location.pathname === '/admin'}
              />
              <NavItem
                to="/admin/assets"
                icon={<Upload className="w-5 h-5" />}
                label="Assets"
                active={location.pathname.startsWith('/admin/assets')}
              />
              <NavItem
                to="/admin/users"
                icon={<Users className="w-5 h-5" />}
                label="Users"
                active={location.pathname.startsWith('/admin/users')}
              />
              <NavItem
                to="/admin/settings"
                icon={<Settings className="w-5 h-5" />}
                label="Settings"
                active={location.pathname.startsWith('/admin/settings')}
              />
            </nav>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}