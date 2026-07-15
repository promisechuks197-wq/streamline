import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const getBadgeStyles = (badge) => {
  const base = 'px-2.5 py-0.5 rounded-full text-xs font-semibold text-white';
  switch (badge) {
    case 'New':
    case 'Popular':
      return `${base} bg-brand-500`;
    case 'Sale':
      return `${base} bg-red-500`;
    case 'Premium':
      return `${base} bg-dark-900`;
    default:
      return `${base} bg-brand-500`;
  }
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const [selectedSize, setSelectedSize] = useState(null);

  const {
    id,
    name,
    brand,
    price,
    originalPrice,
    rating,
    reviews,
    images,
    sizes,
    badge,
    inStock,
  } = product;

  const inWishlist = isInWishlist(id);
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(
      inWishlist ? `${name} removed from wishlist` : `${name} added to wishlist`
    );
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = selectedSize || (sizes && sizes.length > 0 ? sizes[0] : null);
    if (size) {
      addItem(product, size, null, 1);
      addToast(`${name} (${size}) added to cart`);
    } else {
      addItem(product, null, null, 1);
      addToast(`${name} added to cart`);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
        );
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-dark-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <Link to={`/product/${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-800">
          <img
            src={images && images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge Overlay */}
          {badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className={getBadgeStyles(badge)}>{badge}</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-dark-700 transition-colors duration-200"
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors duration-200 ${
                inWishlist
                  ? 'fill-red-500 text-red-500'
                  : 'text-dark-500 dark:text-gray-400'
              }`}
            />
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-dark-700 hover:scale-110"
          >
            <Eye className="w-5 h-5 text-dark-700 dark:text-gray-200" />
          </button>

          {/* Sold Out Overlay */}
          {!inStock && (
            <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm tracking-wide uppercase">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Brand */}
          <p className="text-xs font-medium text-dark-500 dark:text-gray-400 uppercase tracking-wider">
            {brand}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-dark-900 dark:text-white line-clamp-1">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
            <span className="text-xs text-dark-500 dark:text-gray-400">
              ({reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-dark-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-sm text-dark-400 dark:text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Size Preview */}
          {sizes && sizes.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {sizes.slice(0, 3).map((size) => (
                <span
                  key={size}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-colors duration-200 ${
                    selectedSize === size
                      ? 'border-brand-500 text-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'border-gray-200 dark:border-dark-700 text-dark-500 dark:text-gray-400'
                  }`}
                >
                  {size}
                </span>
              ))}
              {sizes.length > 3 && (
                <span className="text-[10px] text-dark-400 dark:text-gray-500">
                  +{sizes.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            inStock
              ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:shadow-md active:scale-[0.98]'
              : 'bg-gray-200 dark:bg-dark-700 text-dark-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {inStock ? `Add to Cart${selectedSize ? ` - ${selectedSize}` : ''}` : 'Sold Out'}
        </button>
      </div>
    </motion.div>
  );
}
