import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, CreditCard, Shield } from 'lucide-react';

const shopLinks = [
  { name: 'Men', path: '/men' },
  { name: 'Women', path: '/women' },
  { name: 'Kids', path: '/kids' },
  { name: 'New Arrivals', path: '/new-arrivals' },
  { name: 'Sale', path: '/sale' },
  { name: 'Best Sellers', path: '/shop' },
];

const helpLinks = [
  { name: 'FAQ', path: '/faq' },
  { name: 'Shipping', path: '/shipping' },
  { name: 'Returns', path: '/returns' },
  { name: 'Size Guide', path: '/size-guide' },
  { name: 'Contact Us', path: '/contact' },
];

const companyLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Careers', path: '/careers' },
  { name: 'Press', path: '/press' },
  { name: 'Sustainability', path: '/sustainability' },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Youtube, label: 'Youtube', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-dark-950 dark:bg-black text-gray-300 transition-colors duration-300">
      {/* Newsletter section */}
      <div className="border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-display font-bold text-white">Stay in the Loop</h3>
              <p className="text-gray-400 mt-1">Subscribe for exclusive drops, restocks, and offers.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 md:w-72 px-4 py-3 rounded-l-lg bg-dark-800 text-white placeholder-gray-500 border border-dark-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-r-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors duration-200 whitespace-nowrap"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="font-display text-2xl font-bold">
                Stream<span className="text-brand-500">Lined</span>
              </h2>
            </Link>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Premium Footwear for the Modern Lifestyle
            </p>
            <div className="flex items-center space-x-3 mt-5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg bg-dark-800 text-gray-400 hover:bg-brand-500 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 text-sm hover:text-brand-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">Help</h4>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 text-sm hover:text-brand-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 text-sm hover:text-brand-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">&copy; 2025 StreamLined. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Buyer Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
