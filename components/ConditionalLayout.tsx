'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountPage = pathname.startsWith('/account');
  const isProductsPage = pathname.startsWith('/products');
  const isSigninPage = pathname.startsWith('/signin');
  const isCheckoutPage = pathname.startsWith('/checkout');
  const isHomePage = pathname === '/';

  if (isAdminRoute) {
    // Admin routes - no navbar/footer
    return <main className="min-h-screen">{children}</main>;
  }

  // Hide footer on account, products, signin, checkout, and home pages
  const shouldHideFooter = isAccountPage || isProductsPage || isSigninPage || isCheckoutPage || isHomePage;

  // Customer routes - with navbar and conditionally with footer
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      {!shouldHideFooter && <Footer />}
    </>
  );
}
