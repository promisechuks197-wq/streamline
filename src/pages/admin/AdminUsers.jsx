import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Edit,
  Trash2,
  UserPlus,
  X,
  Shield,
  User,
  Mail,
  Calendar,
  MoreVertical,
} from 'lucide-react'

const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', orders: 12, spent: 1849.92, joined: 'Jan 15, 2024', status: 'Active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', role: 'Customer', orders: 8, spent: 1249.94, joined: 'Feb 3, 2024', status: 'Active' },
  { id: 3, name: 'Mike Chen', email: 'mike@email.com', role: 'Customer', orders: 15, spent: 2349.85, joined: 'Jan 22, 2024', status: 'Active' },
  { id: 4, name: 'Emma Wilson', email: 'emma@email.com', role: 'Customer', orders: 5, spent: 749.95, joined: 'Mar 10, 2024', status: 'Active' },
  { id: 5, name: 'James Brown', email: 'james@email.com', role: 'Customer', orders: 3, spent: 389.97, joined: 'Apr 5, 2024', status: 'Inactive' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@email.com', role: 'Customer', orders: 10, spent: 1599.90, joined: 'Feb 18, 2024', status: 'Active' },
  { id: 7, name: 'David Lee', email: 'david@email.com', role: 'Admin', orders: 0, spent: 0, joined: 'Jan 1, 2024', status: 'Active' },
  { id: 8, name: 'Anna Taylor', email: 'anna@email.com', role: 'Customer', orders: 7, spent: 979.93, joined: 'Mar 22, 2024', status: 'Active' },
  { id: 9, name: 'Tom Garcia', email: 'tom@email.com', role: 'Customer', orders: 2, spent: 349.98, joined: 'May 1, 2024', status: 'Inactive' },
]

const roleOptions = ['Customer', 'Admin']

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const handleEdit = (user) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    setDeleteConfirm(null)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const updated = {
      ...editingUser,
      name: form.get('name'),
      email: form.get('email'),
      role: form.get('role'),
      status: form.get('status'),
    }
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    setShowModal(false)
    setEditingUser(null)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const newUser = {
      id: Date.now(),
      name: form.get('name'),
      email: form.get('email'),
      role: form.get('role'),
      orders: 0,
      spent: 0,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active',
    }
    setUsers((prev) => [...prev, newUser])
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 dark:text-gray-400">{filtered.length} users total</p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
        </div>
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === 'Active').length}</p>
        </div>
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${users.reduce((s, u) => s + u.spent, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Customer', 'Admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                roleFilter === r
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-800 hover:border-brand-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-800 bg-gray-50 dark:bg-dark-800/50">
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">User</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Orders</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Spent</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Joined</th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-800">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {user.role === 'Admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{user.orders}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">${user.spent.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{user.joined}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
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
            onClick={() => { setShowModal(false); setEditingUser(null) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-900 rounded-2xl w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingUser ? 'Edit User' : 'Add User'}
                </h2>
                <button onClick={() => { setShowModal(false); setEditingUser(null) }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={editingUser ? handleSave : handleAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    name="name"
                    defaultValue={editingUser?.name || ''}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingUser?.email || ''}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                      name="role"
                      defaultValue={editingUser?.role || 'Customer'}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  {editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select
                        name="status"
                        defaultValue={editingUser?.status}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditingUser(null) }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-dark-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
                  >
                    {editingUser ? 'Save Changes' : 'Add User'}
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete User?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                This action cannot be undone. The user will be permanently removed.
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
