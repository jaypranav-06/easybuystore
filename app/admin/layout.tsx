import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log(' Admin layout - session:', session);

  // If no session or not admin, redirect to signin
  if (!session?.user || session.user.role !== 'admin') {
    console.log(' Not admin - redirecting to signin');
    redirect('/signin');
  }

  const admin = {
    admin_id: parseInt(session.user.id),
    username: session.user.name || 'Admin',
    email: session.user.email || '',
    role: session.user.role,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar admin={admin} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
