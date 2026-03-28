'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Home,
  LogOut,
  Tag,
  UserCog,
} from 'lucide-react';

interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: string;
  type: 'admin';
}

interface AdminSidebarProps {
  admin: AdminUser;
}

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/staff', label: 'Staff', icon: UserCog, adminOnly: true },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      // Use absolute URL for production compatibility
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      await signOut({ callbackUrl: `${baseUrl}/signin` });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EB</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">EasyBuyStore</h2>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            // Hide admin-only items from non-admins
            if (item.adminOnly && admin.role !== 'admin') {
              return null;
            }

            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Admin Info */}
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Signed in as</p>
            <p className="text-sm font-semibold text-gray-900">{admin.username}</p>
            <p className="text-xs text-gray-600">{admin.email}</p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
          >
            <Home className="w-5 h-5" />
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
