import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Package, Tag, ArrowLeft, Pill, FileText } from 'lucide-react';
import { getSiteAssetsMap } from '@/lib/db';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifyAdminSessionToken(token);
  if (!session) {
    redirect('/admin/login');
  }

  const assets = await getSiteAssetsMap();
  const companyLogoUrl = assets.company_logo_url || '';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            {companyLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={companyLogoUrl} alt="Rezichem logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Pill className="w-4 h-4 text-white" />
              </div>
            )}
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
          <Link href="/admin/downloads" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors">
            <FileText className="w-4 h-4" /> Downloads
          </Link>
        </nav>
        <div className="p-3 border-t border-neutral-100 space-y-1.5">
          <Link href="/" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
          </Link>
          <AdminLogoutButton className="w-full px-3 py-2 rounded-lg hover:bg-neutral-50" />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
