import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import Breadcrumb from '../components/Breadcrumb'

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlist()
  const { addItem } = useCart()
  const { addToast } = useToast()

  const handleAddToCart = (product) => {
    addItem(product, product.sizes[0], product.colors[0])
    addToast(`${product.name} added to cart`)
  }

  const handleRemove = (product) => {
    toggleWishlist(product)
    addToast(`${product.name} removed from wishlist`)
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-32 text-center">
        <Heart size={64} className="mx-auto text-dark-300 mb-6" />
        <h1 className="text-3xl font-display font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-dark-500 mb-8 max-w-md mx-auto">
          Save your favorite items here to buy them later or share with friends.
        </p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag size={18} />
          Explore Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">
          My Wishlist <span className="text-dark-400 text-xl">({items.length})</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-dark-900 rounded-2xl overflow-hidden shadow-card group"
          >
            <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-gray-100 dark:bg-dark-800">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            
            <div className="p-4">
              <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">{product.brand}</p>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-sm mb-2 line-clamp-1 hover:text-brand-500 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-dark-400 line-through text-sm">${product.originalPrice}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2 px-3 rounded-xl transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product)}
                  className="p-2 rounded-xl border border-dark-200 dark:border-dark-700 text-dark-500 hover:text-red-500 hover:border-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
