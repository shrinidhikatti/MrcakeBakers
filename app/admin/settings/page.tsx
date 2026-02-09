'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  Bell,
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Layout,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('store');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeHero, setActiveHero] = useState('variant1');

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'MrCake Bakers',
    email: 'contact@mrcakebakers.com',
    phone: '+91 98765 43210',
    address: '123 Bakery Street, Bangalore, Karnataka 560001',
    openingHours: '9:00 AM - 9:00 PM',
    closedDays: 'None',
  });

  const [deliverySettings, setDeliverySettings] = useState({
    deliveryFee: '50',
    freeDeliveryAbove: '500',
    minOrderAmount: '200',
    deliveryRadius: '15',
    estimatedTime: '45-60 minutes',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderStatusUpdate: true,
    deliveryNotification: true,
    promotionalEmails: false,
  });

  // Load current hero selection on mount
  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/hero');
        if (response.ok) {
          const data = await response.json();
          setActiveHero(data.activeHeroId || 'variant1');
        }
      } catch (error) {
        console.error('Error fetching hero settings:', error);
      }
    };

    fetchHeroSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    if (activeTab === 'hero') {
      // Save hero selection to database
      try {
        const response = await fetch('/api/admin/settings/hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heroId: activeHero }),
        });

        if (response.ok) {
          setMessage('Hero selection saved successfully!');
        } else {
          setMessage('Failed to save hero selection');
        }
      } catch (error) {
        setMessage('Error saving hero selection');
      }
    } else {
      // Simulate save for other tabs - in production, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage('Settings saved successfully!');
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'store', label: 'Store Info', icon: Store },
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary-600" />
            Store Settings
          </h1>
          <p className="mt-2 text-gray-600">Manage your store configuration</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Store Info Tab */}
            {activeTab === 'store' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Store className="h-4 w-4 inline mr-2" />
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeSettings.storeName}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, storeName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={storeSettings.email}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={storeSettings.phone}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Store Address
                  </label>
                  <textarea
                    value={storeSettings.address}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, address: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={storeSettings.openingHours}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, openingHours: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closed Days
                    </label>
                    <input
                      type="text"
                      value={storeSettings.closedDays}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, closedDays: e.target.value })
                      }
                      placeholder="e.g., Sunday"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hero Selection Tab */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select Homepage Hero Section
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose which hero design to display on your homepage. Changes will be visible to all visitors.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hero Variant 1 - Light Theme */}
                  <label
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${
                      activeHero === 'variant1'
                        ? 'border-primary-600 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hero"
                      value="variant1"
                      checked={activeHero === 'variant1'}
                      onChange={(e) => setActiveHero(e.target.value)}
                      className="sr-only"
                    />
                    <div className="aspect-video bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-100 p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800 mb-2">
                          Sweet Moments
                        </div>
                        <div className="text-sm text-gray-600">Light & Warm Theme</div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Hero Variant 1</p>
                          <p className="text-xs text-gray-500">Traditional bakery feel</p>
                        </div>
                        {activeHero === 'variant1' && (
                          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Hero Variant 2 - Dark Theme */}
                  <label
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${
                      activeHero === 'variant2'
                        ? 'border-primary-600 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hero"
                      value="variant2"
                      checked={activeHero === 'variant2'}
                      onChange={(e) => setActiveHero(e.target.value)}
                      className="sr-only"
                    />
                    <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-red-950 p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">
                          Art of Baking
                        </div>
                        <div className="text-sm text-gray-300">Modern & Premium</div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Hero Variant 2</p>
                          <p className="text-xs text-gray-500">Sleek & artistic design</p>
                        </div>
                        {activeHero === 'variant2' && (
                          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Placeholder for Variant 3 */}
                  <label className="relative cursor-not-allowed rounded-xl overflow-hidden border-4 border-dashed border-gray-300 opacity-50">
                    <div className="aspect-video bg-gray-100 p-4 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-2xl mb-2">+</div>
                        <div className="text-sm">Hero Variant 3</div>
                        <div className="text-xs">Coming Soon</div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="font-semibold text-gray-400">Available Soon</p>
                    </div>
                  </label>

                  {/* Placeholder for Variant 4 */}
                  <label className="relative cursor-not-allowed rounded-xl overflow-hidden border-4 border-dashed border-gray-300 opacity-50">
                    <div className="aspect-video bg-gray-100 p-4 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-2xl mb-2">+</div>
                        <div className="text-sm">Hero Variant 4</div>
                        <div className="text-xs">Coming Soon</div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="font-semibold text-gray-400">Available Soon</p>
                    </div>
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> You can create and add more hero variants by adding new components to the{' '}
                    <code className="bg-blue-100 px-1 py-0.5 rounded">components/heroes/</code> folder.
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Tab */}
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={deliverySettings.deliveryFee}
                      onChange={(e) =>
                        setDeliverySettings({ ...deliverySettings, deliveryFee: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Delivery Above (₹)
                    </label>
                    <input
                      type="number"
                      value={deliverySettings.freeDeliveryAbove}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          freeDeliveryAbove: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={deliverySettings.minOrderAmount}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          minOrderAmount: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Radius (km)
                    </label>
                    <input
                      type="number"
                      value={deliverySettings.deliveryRadius}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          deliveryRadius: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery Time
                  </label>
                  <input
                    type="text"
                    value={deliverySettings.estimatedTime}
                    onChange={(e) =>
                      setDeliverySettings({
                        ...deliverySettings,
                        estimatedTime: e.target.value,
                      })
                    }
                    placeholder="e.g., 30-45 minutes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <p className="text-sm text-gray-600 mb-4">
                  Configure which notifications are sent to customers.
                </p>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Order Confirmation</p>
                      <p className="text-sm text-gray-500">
                        Send email when order is placed
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderConfirmation}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          orderConfirmation: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Order Status Updates</p>
                      <p className="text-sm text-gray-500">
                        Notify when order status changes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderStatusUpdate}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          orderStatusUpdate: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Delivery Notifications</p>
                      <p className="text-sm text-gray-500">
                        Notify when delivery partner is assigned
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.deliveryNotification}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          deliveryNotification: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Promotional Emails</p>
                      <p className="text-sm text-gray-500">
                        Send marketing and promotional content
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.promotionalEmails}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          promotionalEmails: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> These settings are stored locally for demonstration purposes.
            In a production environment, they would be saved to a database and affect store operations.
          </p>
        </div>
      </div>
    </div>
  );
}
