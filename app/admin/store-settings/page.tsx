'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Store, Mail, Phone, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';
import { LkrIcon } from '@/components/icons/LkrIcon';

interface StoreSettings {
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  currency: string;
}

export default function StoreSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: 'EasyBuyStore',
    store_email: 'contact@easybuystore.com',
    store_phone: '+1 (555) 123-4567',
    store_address: '123 Fashion Street, New York, NY 10001',
    tax_rate: 10,
    shipping_fee: 10,
    free_shipping_threshold: 50,
    currency: 'USD',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/store-settings');
      const data = await response.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/store-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Store settings updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-light mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Settings</h1>
        <p className="text-gray-600">Configure your store information and preferences</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Store Information</h2>
              <p className="text-sm text-gray-600">Basic store details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Store Email
              </label>
              <input
                type="email"
                value={settings.store_email}
                onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Store Phone
              </label>
              <input
                type="tel"
                value={settings.store_phone}
                onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Store Address
              </label>
              <textarea
                rows={3}
                value={settings.store_address}
                onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing & Tax */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <LkrIcon className="w-5 h-5 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pricing & Tax</h2>
              <p className="text-sm text-gray-600">Configure tax rates and pricing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settings.tax_rate}
                onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Applied to all orders</p>
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Shipping Settings</h2>
              <p className="text-sm text-gray-600">Configure shipping fees and thresholds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Shipping Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.shipping_fee}
                onChange={(e) => setSettings({ ...settings, shipping_fee: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Charged for orders below threshold</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Orders above this amount ship free</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/settings"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
