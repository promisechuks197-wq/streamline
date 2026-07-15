import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 800))

    const result = login(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Stream<span className="text-brand-500">Lined</span>
            </h1>
          </Link>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Admin Portal</p>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl border border-gray-200 dark:border-dark-800 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sign in to Admin</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@streamlined.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Demo: <span className="font-mono">admin@streamlined.com</span> / <span className="font-mono">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="text-brand-500 hover:text-brand-600 font-medium">Back to Store</Link>
        </p>
      </motion.div>
    </div>
  )
}
