import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Star,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const orders = [
  {
    id: '#SE-2024-1001',
    date: 'Nov 15, 2024',
    status: 'Delivered',
    items: [
      { name: 'Air Max 90 Premium', size: '10', qty: 1, price: 179.99 },
      { name: 'Classic Leather Boots', size: '9', qty: 1, price: 169.99 },
    ],
    total: 349.98,
  },
  {
    id: '#SE-2024-0987',
    date: 'Nov 12, 2024',
    status: 'Shipped',
    items: [
      { name: 'Running Elite Pro', size: '11', qty: 1, price: 189.99 },
    ],
    total: 189.99,
  },
  {
    id: '#SE-2024-0954',
    date: 'Nov 8, 2024',
    status: 'Processing',
    items: [
      { name: 'Sport Runner X', size: '10', qty: 1, price: 149.99 },
      { name: 'Urban Walk Classic', size: '9', qty: 1, price: 149.99 },
      { name: 'Trail Master GTX', size: '11', qty: 1, price: 149.99 },
    ],
    total: 449.97,
  },
];

const statusColor = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
};

const addresses = [
  {
    id: 1,
    label: 'Home',
    name: 'John Doe',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '(555) 123-4567',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Office',
    name: 'John Doe',
    street: '456 Business Ave, Suite 200',
    city: 'New York',
    state: 'NY',
    zip: '10002',
    phone: '(555) 987-6543',
    isDefault: false,
  },
];

const navItems = [
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const fadeSlide = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function Account() {
  const [view, setView] = useState('orders');
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { items: wishlist, toggleWishlist } = useWishlist();
  const { user, logout, updateProfile, changePassword } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    promotions: false,
    orderUpdates: true,
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user && !showLogout) {
      navigate('/login');
    }
  }, [user, navigate, showLogout]);

  const toggleNotif = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    navigate('/');
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });
    try {
      await updateProfile({ name: profile.name, phone: profile.phone });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwords.newPass !== passwords.confirm) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.newPass.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(passwords.current, passwords.newPass);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const renderOrders = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <p className="font-semibold text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            <div className="divide-y divide-gray-100 mb-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 text-sm text-gray-700"
                >
                  <span>
                    {item.name} (Size {item.size}) x {item.qty}
                  </span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-900">
                Total: ${order.total.toFixed(2)}
              </p>
              <button className="flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <button className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <motion.div
            key={addr.id}
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl border border-gray-200 p-6 relative"
          >
            {addr.isDefault && (
              <span className="absolute top-4 right-4 bg-brand-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {addr.label}
            </p>
            <p className="font-medium text-gray-900 mb-1">{addr.name}</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {addr.street}
              <br />
              {addr.city}, {addr.state} {addr.zip}
              <br />
              {addr.phone}
            </p>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-brand-500 transition-colors">
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        My Wishlist{' '}
        {wishlist.length > 0 && (
          <span className="text-sm font-normal text-gray-500">
            ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
          </span>
        )}
      </h2>

      {wishlist.length === 0 ? (
        <motion.div
          variants={fadeSlide}
          initial="hidden"
          animate="visible"
          className="text-center py-16"
        >
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors"
          >
            Browse Shop
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="font-bold text-gray-900 mb-3">
                  ${item.price.toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    addItem(item, item.sizes?.[0] || null, item.colors?.[0]?.name || null, 1);
                    toggleWishlist(item);
                  }}
                  className="w-full bg-brand-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
                >
                  Add to Cart
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Account Settings
        </h2>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            Profile Information
          </h3>

          {profileMsg.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSave}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={profileLoading}
              className="mt-4 bg-brand-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-500" />
          Change Password
        </h3>

        {passwordMsg.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, current: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNew ? 'text' : 'password'}
                value={passwords.newPass}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, newPass: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, confirm: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email notifications' },
            { key: 'promotions', label: 'Promotional offers' },
            { key: 'orderUpdates', label: 'Order status updates' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <button
                onClick={() => toggleNotif(key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications[key] ? 'bg-brand-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications[key] ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const viewMap = {
    orders: renderOrders,
    addresses: renderAddresses,
    wishlist: renderWishlist,
    settings: renderSettings,
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-brand-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">My Account</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
              <div className="flex items-center gap-3 px-3 py-3 mb-2">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                    {userInitials}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      view === key
                        ? 'bg-brand-50 text-brand-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {label}
                  </button>
                ))}

                <div className="border-t border-gray-100 my-2" />

                <button
                  onClick={() => setShowLogout(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Mobile Tabs */}
          <div className="lg:hidden overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-2">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    view === key
                      ? 'bg-brand-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <button
                onClick={() => setShowLogout(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white text-red-600 border border-gray-200 hover:border-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
              >
                {viewMap[view]()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowLogout(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
