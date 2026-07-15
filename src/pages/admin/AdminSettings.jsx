import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Store,
  Bell,
  Shield,
  Palette,
  Save,
  CheckCircle,
} from 'lucide-react'

const initialSettings = {
  storeName: 'StreamLined',
  storeEmail: 'hello@streamlined.com',
  storePhone: '(555) 123-4567',
  storeAddress: '123 Fashion Ave, New York, NY 10001',
  currency: 'USD',
  taxRate: 8.5,
  lowStockThreshold: 10,
  emailNotifications: true,
  orderNotifications: true,
  lowStockAlerts: true,
  marketingEmails: false,
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings)
  const [saved, setSaved] = useState(false)

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your store settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Store Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-6"
      >
        <h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
          <Store className="w-5 h-5 text-gray-500" />
          Store Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Name</label>
            <input
              value={settings.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={settings.storeEmail}
              onChange={(e) => handleChange('storeEmail', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input
              type="tel"
              value={settings.storePhone}
              onChange={(e) => handleChange('storePhone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <input
              value={settings.storeAddress}
              onChange={(e) => handleChange('storeAddress', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-6"
      >
        <h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
          <Bell className="w-5 h-5 text-gray-500" />
          Notifications
        </h2>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive email updates about your store' },
            { key: 'orderNotifications', label: 'Order notifications', desc: 'Get notified when new orders are placed' },
            { key: 'lowStockAlerts', label: 'Low stock alerts', desc: 'Alert when products are running low' },
            { key: 'marketingEmails', label: 'Marketing emails', desc: 'Receive tips and promotional content' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => handleChange(key, !settings[key])}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings[key] ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[key] ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-6"
      >
        <h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
          <Shield className="w-5 h-5 text-gray-500" />
          Security
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Email</label>
            <input
              type="email"
              value="admin@streamlined.com"
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Low Stock Threshold</label>
            <input
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
