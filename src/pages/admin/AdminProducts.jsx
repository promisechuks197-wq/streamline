import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  ChevronDown,
  Star,
  Filter,
} from 'lucide-react'
import { products as initialProducts } from '../../data/products'

const categories = ['All', 'Running', 'Casual', 'Sports', 'Lifestyle', 'Outdoor']
const statusOptions = ['Active', 'Draft', 'Out of Stock']

export default function AdminProducts() {
  const [productsList, setProductsList] = useState(
    initialProducts.map((p, i) => ({
      ...p,
      status: i % 7 === 0 ? 'Draft' : i % 5 === 0 ? 'Out of Stock' : 'Active',
      stock: i % 5 === 0 ? 0 : Math.floor(Math.random() * 100) + 10,
    }))
  )
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = productsList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || p.category?.toLowerCase() === category.toLowerCase()
    return matchSearch && matchCategory
  })

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirm(null)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const updated = {
      ...editingProduct,
      name: form.get('name'),
      price: parseFloat(form.get('price')),
      category: form.get('category'),
      status: form.get('status'),
      stock: parseInt(form.get('stock')),
    }
    setProductsList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setShowModal(false)
    setEditingProduct(null)
  }

  const statusColors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Out of Stock': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">{filtered.length} products total</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                category === c
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-800 hover:border-brand-500'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-800 bg-gray-50 dark:bg-dark-800/50">
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Product</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Price</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Stock</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-800">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-dark-800"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{product.category}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">${product.price?.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{product.stock}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => { setShowModal(false); setEditingProduct(null) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={() => { setShowModal(false); setEditingProduct(null) }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    name="name"
                    defaultValue={editingProduct?.name || ''}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price || ''}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      defaultValue={editingProduct?.stock || 0}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      name="category"
                      defaultValue={editingProduct?.category || 'Running'}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    >
                      {categories.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={editingProduct?.status || 'Active'}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditingProduct(null) }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-dark-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
                  >
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-900 rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                This action cannot be undone. The product will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-dark-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
