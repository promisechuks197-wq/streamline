import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  ChevronLeft,
  Check,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import ReviewCard from '../components/ReviewCard';
import Modal from '../components/Modal';
import { products } from '../data/products';

const mockReviews = [
  {
    id: 1,
    author: 'Alex Thompson',
    rating: 5,
    date: '2026-06-15',
    title: 'Best shoes I\'ve ever owned',
    content: 'Absolutely incredible quality and comfort. The fit is perfect and the materials feel premium. I\'ve received so many compliments. Worth every penny!',
    avatar: 'AT',
  },
  {
    id: 2,
    author: 'Sarah Mitchell',
    rating: 4,
    date: '2026-06-02',
    title: 'Great quality, runs slightly small',
    content: 'The craftsmanship is outstanding and the design is exactly what I was looking for. Only reason for 4 stars is they run a bit small — I\'d recommend going half a size up. Otherwise, perfect.',
    avatar: 'SM',
  },
  {
    id: 3,
    author: 'James Rodriguez',
    rating: 5,
    date: '2026-05-20',
    title: 'Premium in every way',
    content: 'From the packaging to the shoe itself, everything screams luxury. The comfort level is unreal — I can wear these all day without any issues. Highly recommend.',
    avatar: 'JR',
  },
  {
    id: 4,
    author: 'Emily Chen',
    rating: 5,
    date: '2026-05-08',
    title: 'Exceeded expectations',
    content: 'I was hesitant about the price but these shoes completely changed my mind. The attention to detail is remarkable and they look even better in person than in photos.',
    avatar: 'EC',
  },
];

const tabLabels = ['Description', 'Features', 'Reviews'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === id || p.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);

  const addToCartRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setSelectedColor(0);
    setSelectedSize('');
    setQuantity(1);
    setActiveTab(0);
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyBarVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px 0px -80px 0px' }
    );

    const ref = addToCartRef.current;
    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-colors"
          >
            <ShoppingBag size={18} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const colors = product.colors || [{ name: 'Default', hex: '#333' }];
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
  const features = product.features || [
    'Premium materials',
    'Handcrafted construction',
    'Cushioned insole for all-day comfort',
    'Durable rubber outsole',
    'Breathable lining',
  ];
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const averageRating =
    product.rating || mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length;
  const reviewCount = product.reviewCount || mockReviews.length;

  const isInStock = product.inStock !== false;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product.category, href: `/shop?category=${product.category}` },
    { label: product.name },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please select a size', 'warning');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor: colors[selectedColor]?.name,
      });
    }
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      showToast('Please select a size', 'warning');
      return;
    }
    addToCart({
      ...product,
      selectedSize,
      selectedColor: colors[selectedColor]?.name,
      quantity,
    });
    navigate('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    if (isInWishlist(product.id)) {
      showToast('Removed from wishlist', 'info');
    } else {
      showToast('Added to wishlist', 'success');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription || product.description,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  const handleThumbnailNav = (direction) => {
    setSelectedImage((prev) => {
      if (direction === 'prev') {
        return prev === 0 ? images.length - 1 : prev - 1;
      }
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 lg:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group"
                initial={false}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={`${product.name} - View ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleThumbnailNav('prev')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => handleThumbnailNav('next')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {product.discount && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </motion.div>

              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === idx
                          ? 'border-brand-500 shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-500 mb-2">
                  {product.brand || 'Premium Collection'}
                </p>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {averageRating.toFixed(1)}
                </span>
                <a href="#reviews" className="text-sm text-gray-500 hover:text-brand-500 transition-colors">
                  ({reviewCount} reviews)
                </a>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price?.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discount && (
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              <div className="border-t border-gray-100" />

              {product.shortDescription && (
                <p className="text-gray-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Color Selector */}
              {colors.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Color:{' '}
                    <span className="font-normal text-gray-600">
                      {colors[selectedColor]?.name}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(idx)}
                        className={`w-10 h-10 rounded-full transition-all duration-200 ${
                          selectedColor === idx
                            ? 'ring-2 ring-brand-500 ring-offset-2'
                            : 'ring-1 ring-gray-200 hover:ring-gray-400'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={`Select color ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Size:{' '}
                  <span className="font-normal text-gray-600">
                    {selectedSize || 'Select a size'}
                  </span>
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 px-1 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-brand-500 bg-brand-500 text-white shadow-md'
                          : 'border-gray-200 text-gray-700 hover:border-brand-300 hover:bg-brand-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isInStock ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isInStock ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">Quantity</p>
                <div className="inline-flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-40"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-14 text-center font-semibold text-lg tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-40"
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3" ref={addToCartRef}>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    className="flex-1 flex items-center justify-center gap-2.5 bg-brand-500 text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={20} />
                    Add to Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWishlist}
                    className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
                      isInWishlist(product.id)
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-400'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={20}
                      className={isInWishlist(product.id) ? 'fill-current' : ''}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-3.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all duration-200"
                    aria-label="Share product"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={!isInStock}
                  className="w-full flex items-center justify-center gap-2.5 bg-gray-900 text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </motion.button>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 pt-2">
                {features.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check size={16} className="text-brand-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Shipping Info */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <Truck size={20} className="text-brand-500 shrink-0" />
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $100. Standard delivery 3-5 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-16 lg:mt-24" id="reviews">
            <div className="border-b border-gray-200">
              <div className="flex gap-0 overflow-x-auto">
                {tabLabels.map((label, idx) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(idx)}
                    className={`relative px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                      activeTab === idx ? 'text-brand-500' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {label}
                    {idx === 2 && (
                      <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                        {reviewCount}
                      </span>
                    )}
                    {activeTab === idx && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="prose prose-gray max-w-none"
                  >
                    <p className="text-gray-600 leading-relaxed text-base">
                      {product.description || `Experience unparalleled luxury with the ${product.name}. Crafted from the finest materials with meticulous attention to detail, this shoe represents the perfect fusion of style and comfort. Every stitch, every curve, and every element has been carefully considered to deliver an exceptional wearing experience that stands the test of time.`}
                    </p>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="space-y-3">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-600">
                          <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-50 flex items-center justify-center">
                            <Check size={12} className="text-brand-500" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {mockReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 lg:mt-20 pb-10">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
                You May Also Like
              </h2>
              <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="min-w-[260px] sm:min-w-[280px] snap-start lg:min-w-0">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <AnimatePresence>
        {isStickyBarVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="max-w-xl mx-auto flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                <p className="text-brand-500 font-bold">${product.price?.toFixed(2)}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="flex items-center gap-2 bg-brand-500 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)}>
        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Share Product</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!', 'success');
                setShowShareModal(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Share2 size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Copy Link</p>
                <p className="text-xs text-gray-500">Copy product link to clipboard</p>
              </div>
            </button>
            <button
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(window.location.href)}`,
                  '_blank'
                );
                setShowShareModal(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                <MessageSquare size={18} className="text-sky-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Twitter</p>
                <p className="text-xs text-gray-500">Share on Twitter</p>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}