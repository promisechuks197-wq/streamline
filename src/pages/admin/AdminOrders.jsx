import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Eye,
  ChevronDown,
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'

const initialOrders = [
  { id: '#SE-2024-1248', customer: 'Sarah Johnson', email: 'sarah@email.com', items: [{ name: 'Air Max 90 Premium', size: '9', qty: 1, price: 179.99 }, { name: 'Classic Leather Boots', size: '10', qty: 1, price: 169.99 }], total: 349.98, status: 'Delivered', date: 'Dec 15, 2024', address: '123 Main St, New York, NY 10001' },
  { id: '#SE-2024-1247', customer: 'Mike Chen', email: 'mike@email.com', items: [{ name: 'Running Elite Pro', size: '11', qty: 1, price: 189.99 }], total: 189.99, status: 'Shipped', date: 'Dec 14, 2024', address: '456 Oak Ave, Los Angeles, CA 90001' },
  { id: '#SE-2024-1246', customer: 'Emma Wilson', email: 'emma@email.com', items: [{ name: 'Sport Runner X', size: '8', qty: 1, price: 149.99 }, { name: 'Urban Walk Classic', size: '8', qty: 2, price: 149.99 }], total: 449.97, status: 'Processing', date: 'Dec 14, 2024', address: '789 Pine Rd, Chicago, IL 60601' },
  { id: '#SE-2024-1245', customer: 'James Brown', email: 'james@email.com', items: [{ name: 'Trail Master GTX', size: '10', qty: 1, price: 129.99 }], total: 129.99, status: 'Delivered', date: 'Dec 13, 2024', address: '321 Elm St, Houston, TX 77001' },
  { id: '#SE-2024-1244', customer: 'Lisa Anderson', email: 'lisa@email.com', items: [{ name: 'Cloud Walker Ultra', size: '7', qty: 1, price: 159.99 }, { name: 'Retro Runner V2', size: '7', qty: 1, price: 119.99 }], total: 279.98, status: 'Shipped', date: 'Dec 12, 2024', address: '654 Maple Dr, Phoenix, AZ 85001' },
  { id: '#SE-2024-1243', customer: 'David Lee', email: 'david@email.com', items: [{ name: 'Pro Court Elite', size: '12', qty: 1, price: 199.99 }], total: 199.99, status: 'Cancelled', date: 'Dec 11, 2024', address: '987 Cedar Ln, Philadelphia, PA 19101' },
  { id: '#SE-2024-1242', customer: 'Anna Taylor', email: 'anna@email.com', items: [{ name: 'Street Style Pro', size: '6', qty: 1, price: 139.99 }], total: 139.99, status: 'Processing', date: 'Dec 11, 2024', address: '147 Birch St, San Antonio, TX 78201' },
  { id: '#SE-2024-1241', customer: 'Tom Garcia', email: 'tom@email.com', items: [{ name: 'Marathon Trainer', size: '10', qty: 2, price: 174.99 }], total: 349.98, status: 'Delivered', date: 'Dec 10, 2024', address: '258 Walnut Ave, San Diego, CA 92101' },
]

const statusConfig = {
  Processing: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
  Shipped: { icon: Truck, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
  Delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
  Cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
}

const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewOrder, setViewOrder] = useState(null)

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    if (viewOrder?.id === orderId) {
      setViewOrder((prev) => ({ ...prev, status: newStatus }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-gray-500 dark:text-gray-400">{filtered.length} orders found</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'All' : status)}
              className={`p-4 rounded-xl border transition-colors text-left ${
                statusFilter === status
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-gray-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:border-gray-300 dark:hover:border-dark-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{status}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID or customer..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-800 bg-gray-50 dark:bg-dark-800/50">
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Order</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Items</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Total</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Date</th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-800">
              {filtered.map((order) => {
                const config = statusConfig[order.status]
                const Icon = config.icon
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">{order.id}</td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.email}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="p-2 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-200 dark:border-dark-700 rounded-lg px-2 py-1.5 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {viewOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setViewOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-800">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order {viewOrder.id}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{viewOrder.date}</p>
                </div>
                <button onClick={() => setViewOrder(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Customer</h3>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewOrder.customer}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{viewOrder.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{viewOrder.address}</p>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Update Status</h3>
                  <div className="flex gap-2">
                    {statusOptions.map((s) => {
                      const config = statusConfig[s]
                      return (
                        <button
                          key={s}
                          onClick={() => updateStatus(viewOrder.id, s)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            viewOrder.status === s
                              ? config.color
                              : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Items</h3>
                  <div className="space-y-3">
                    {viewOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-dark-800 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Size {item.size} × {item.qty}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-dark-800 mt-3">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${viewOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
