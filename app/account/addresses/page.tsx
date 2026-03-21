'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Settings, Home } from 'lucide-react';

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?redirect=/account/addresses');
    } else if (status === 'authenticated' && session?.user) {
      fetchUserData();
    }
  }, [status, session, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const hasAddress = userData?.address || userData?.city || userData?.state || userData?.zip_code;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Addresses</h1>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <User className="w-5 h-5" />
                  Account Overview
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Package className="w-5 h-5" />
                  My Orders
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3 px-4 py-3 bg-surface text-primary rounded-lg font-semibold"
                >
                  <MapPin className="w-5 h-5" />
                  Addresses
                </Link>
                <Link
                  href="/account/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {hasAddress ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Default Address</h2>
                  <Link
                    href="/account/settings"
                    className="text-primary hover:text-primary-light text-sm font-semibold"
                  >
                    Edit Address
                  </Link>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {userData?.first_name} {userData?.last_name}
                      </h3>
                      <p className="text-gray-700 mb-1">{userData?.address}</p>
                      {userData?.city && (
                        <p className="text-gray-700 mb-1">
                          {userData.city}
                          {userData?.state && `, ${userData.state}`}
                          {userData?.zip_code && ` ${userData.zip_code}`}
                        </p>
                      )}
                      {userData?.country && (
                        <p className="text-gray-700 mb-3">{userData.country}</p>
                      )}
                      {userData?.phone && (
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Phone:</span> {userData.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This address will be used as the default shipping address
                    for all your orders. You can update it anytime in your account settings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No Address Saved</h2>
                  <p className="text-gray-600 mb-6">
                    You haven't added an address yet. Add one to make checkout faster!
                  </p>
                  <Link
                    href="/account/settings"
                    className="inline-block bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition"
                  >
                    Add Address
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
