import Link from 'next/link';
import { LayoutDashboard, Package, Tag, ArrowLeft, Pill } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-700">Rezichem</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>
        </div>
        <nav className="p-3 flex-1 space-y-1">
          <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors">
            <Package className="w-4 h-4" /> Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors">
            <Tag className="w-4 h-4" /> Categories
          </Link>
        </nav>
        <div className="p-3 border-t border-neutral-100">
          <Link href="/" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-primary-600 px-3 py-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
