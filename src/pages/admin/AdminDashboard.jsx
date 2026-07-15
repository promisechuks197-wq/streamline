import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react'
import { products } from '../../data/products'

const stats = [
  {
    name: 'Total Revenue',
    value: '$48,352',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    name: 'Total Orders',
    value: '1,248',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-blue-500',
  },
  {
    name: 'Products',
    value: products.length.toString(),
    change: '+3',
    trend: 'up',
    icon: Package,
    color: 'bg-purple-500',
  },
  {
    name: 'Active Users',
    value: '2,845',
    change: '-2.1%',
    trend: 'down',
    icon: Users,
    color: 'bg-orange-500',
  },
]

const recentOrders = [
  { id: '#SE-2024-1248', customer: 'Sarah Johnson', total: 349.98, status: 'Delivered', date: '2 min ago' },
  { id: '#SE-2024-1247', customer: 'Mike Chen', total: 189.99, status: 'Shipped', date: '15 min ago' },
  { id: '#SE-2024-1246', customer: 'Emma Wilson', total: 449.97, status: 'Processing', date: '1 hour ago' },
  { id: '#SE-2024-1245', customer: 'James Brown', total: 129.99, status: 'Delivered', date: '2 hours ago' },
  { id: '#SE-2024-1244', customer: 'Lisa Anderson', total: 279.98, status: 'Shipped', date: '3 hours ago' },
]

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
}

const topProducts = products.slice(0, 5).map((p, i) => ({
  ...p,
  sold: Math.floor(Math.random() * 200) + 50,
  revenue: `$${((Math.random() * 5000) + 1000).toFixed(0)}`,
})).sort((a, b) => b.sold - a.sold)

const chartData = [
  { month: 'Jan', revenue: 4200, orders: 89 },
  { month: 'Feb', revenue: 3800, orders: 76 },
  { month: 'Mar', revenue: 5100, orders: 102 },
  { month: 'Apr', revenue: 4700, orders: 94 },
  { month: 'May', revenue: 6200, orders: 124 },
  { month: 'Jun', revenue: 5800, orders: 116 },
  { month: 'Jul', revenue: 7100, orders: 142 },
  { month: 'Aug', revenue: 6800, orders: 136 },
  { month: 'Sep', revenue: 7500, orders: 150 },
  { month: 'Oct', revenue: 8200, orders: 164 },
  { month: 'Nov', revenue: 9100, orders: 182 },
  { month: 'Dec', revenue: 8852, orders: 177 },
]

const maxRevenue = Math.max(...chartData.map((d) => d.revenue))

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin. Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">Last 12 months</span>
          </div>
          <div className="flex items-end gap-2 h-48">
            {chartData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-brand-500/20 dark:bg-brand-500/10 rounded-t-md transition-all hover:bg-brand-500/30 dark:hover:bg-brand-500/20"
                    style={{ height: `${(d.revenue / maxRevenue) * 160}px` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${d.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-6"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500 w-5">#{i + 1}</span>
                <img src={product.images?.[0] || product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{product.sold} sold</p>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{product.revenue}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-800">
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Order</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Total</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-800">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{order.customer}</td>
                  <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
