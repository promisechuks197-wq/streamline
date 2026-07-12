import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Instagram,
  Quote,
  ChevronLeft,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import TestimonialCard from '../components/TestimonialCard';
import Newsletter from '../components/Newsletter';
import { products, categories, testimonials } from '../data/products';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const brandNames = ['Nike', 'Adidas', 'New Balance', 'Puma', 'Under Armour'];

export default function Home() {
  const navigate = useNavigate();
  const marqueeRef = useRef(null);
  const testimonialsScrollRef = useRef(null);

  const bestSellers = products.slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew);

  const scrollTestimonials = (direction) => {
    if (testimonialsScrollRef.current) {
      const amount = 340;
      testimonialsScrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    let animationId;
    let position = 0;
    const speed = 0.5;

    const animate = () => {
      position -= speed;
      if (Math.abs(position) >= marquee.scrollWidth / 2) {
        position = 0;
      }
      marquee.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <main className="overflow-hidden">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600')" }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="container-custom relative z-10 text-center text-white py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block bg-brand-500 text-white text-sm font-medium px-5 py-2 rounded-full mb-6"
            >
              New Collection 2024
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight"
            >
              Step Into
              <br />
              Greatness
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl max-w-xl mx-auto mb-10 text-gray-200"
            >
              Discover the perfect blend of style, comfort, and performance.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 border border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                Explore Collection
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-3 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ========== BRAND MARQUEE ========== */}
      <section className="py-12 border-b border-gray-100 dark:border-dark-800 overflow-hidden">
        <div className="container-custom mb-6">
          <p className="text-center text-sm text-gray-400 uppercase tracking-widest font-medium">
            Trusted by
          </p>
        </div>
        <div className="relative">
          <div
            ref={marqueeRef}
            className="flex items-center gap-16 whitespace-nowrap"
          >
            {[...brandNames, ...brandNames, ...brandNames, ...brandNames].map((brand, i) => (
              <span
                key={i}
                className="text-xl md:text-2xl font-display font-bold text-gray-200 dark:text-dark-600 select-none"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="flex items-end justify-between mb-12"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
                Shop by Category
              </h2>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link
                to="/categories"
                className="hidden sm:inline-flex items-center gap-1 text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={fadeInUp}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 text-brand-500 hover:text-brand-600 font-medium transition-colors"
            >
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== BEST SELLERS ========== */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-3"
            >
              Best Sellers
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 dark:text-gray-400 text-lg">
              Our most loved styles
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="flex gap-6 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible scrollbar-hide"
          >
            {bestSellers.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                className="min-w-[280px] md:min-w-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 font-semibold transition-colors"
            >
              View All Best Sellers
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== FEATURE BANNER ========== */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800"
                alt="Lifestyle"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-8">
              <div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">
                  Designed for Life
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                  Every pair of StreamLined shoes is crafted with precision, blending cutting-edge
                  technology with timeless design. We believe footwear should elevate not just your
                  look, but your entire day.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center gap-3 p-4">
                  <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Free Shipping</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">On orders over $100</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center gap-3 p-4">
                  <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Quality Guarantee</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Premium materials only</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center gap-3 p-4">
                  <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Easy Returns</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">30-day return policy</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== NEW ARRIVALS ========== */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="flex items-end justify-between mb-12"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
                New Arrivals
              </h2>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-1 text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                Explore All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {newArrivals.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-brand-500 hover:text-brand-600 font-medium transition-colors"
            >
              Explore All New Arrivals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="flex items-end justify-between mb-12"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-3">
                What Our Customers Say
              </h2>
            </motion.div>
            <motion.div variants={fadeInUp} className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollTestimonials('left')}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-dark-600 flex items-center justify-center hover:bg-white dark:hover:bg-dark-700 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => scrollTestimonials('right')}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-dark-600 flex items-center justify-center hover:bg-white dark:hover:bg-dark-700 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </motion.div>
          </motion.div>

          <div
            ref={testimonialsScrollRef}
            className="flex gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory"
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-[300px] md:min-w-[340px] snap-start flex-shrink-0"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INSTAGRAM GALLERY ========== */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white"
            >
              Follow Us{' '}
              <span className="text-brand-500">@streamlined</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-4"
          >
            {[
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
              'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
              'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
              'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400',
              'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
              'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
            ].map((url, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  src={url}
                  alt={`Instagram post ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <Newsletter />

      {/* ========== FEATURES BAR ========== */}
      <section className="py-16 bg-gray-50 dark:bg-dark-900 border-t border-gray-100 dark:border-dark-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: 'Free Shipping',
                description: 'Free shipping on all orders over $100',
              },
              {
                icon: Shield,
                title: 'Secure Payment',
                description: 'Your payment is safe with us',
              },
              {
                icon: Headphones,
                title: '24/7 Support',
                description: 'Contact us anytime for help',
              },
              {
                icon: RotateCcw,
                title: 'Easy Returns',
                description: 'Hassle-free 30-day returns',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-4 p-6"
              >
                <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
