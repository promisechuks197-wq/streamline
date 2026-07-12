import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Breadcrumb from '../components/Breadcrumb';
import Pagination from '../components/Pagination';
import { products } from '../data/products';

const ITEMS_PER_PAGE = 9;

const defaultFilters = {
  categories: [],
  genders: [],
  sizes: [],
  colors: [],
  priceMin: 0,
  priceMax: 500,
  sort: 'newest',
};

function sortProducts(items, sortValue) {
  const sorted = [...items];
  switch (sortValue) {
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    case 'best_selling':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'highest_rated':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

const filterLabels = {
  categories: (v) => v,
  genders: (v) => v,
  sizes: (v) => `Size ${v}`,
  colors: (v) => v,
  priceMin: (v) => `Min $${v}`,
  priceMax: (v) => `Max $${v}`,
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [filters, setFilters] = useState({
    ...defaultFilters,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && !filters.categories.includes(category)) {
      setFilters((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      )
        return false;
      if (
        filters.genders.length > 0 &&
        !filters.genders.includes(product.gender)
      )
        return false;
      if (
        filters.sizes.length > 0 &&
        !product.sizes.some((s) => filters.sizes.includes(s))
      )
        return false;
      if (
        filters.colors.length > 0 &&
        !product.colors.some((c) => filters.colors.includes(c))
      )
        return false;
      if (product.price < filters.priceMin) return false;
      if (product.price > filters.priceMax) return false;
      return true;
    });
  }, [filters]);

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, filters.sort),
    [filteredProducts, filters.sort]
  );

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const activeFilterTags = useMemo(() => {
    const tags = [];
    filters.categories.forEach((v) =>
      tags.push({ key: 'categories', value: v, label: v })
    );
    filters.genders.forEach((v) =>
      tags.push({ key: 'genders', value: v, label: v })
    );
    filters.sizes.forEach((v) =>
      tags.push({ key: 'sizes', value: v, label: `Size ${v}` })
    );
    filters.colors.forEach((v) =>
      tags.push({ key: 'colors', value: v, label: v })
    );
    if (filters.priceMin > 0) {
      tags.push({
        key: 'priceMin',
        value: filters.priceMin,
        label: `Min $${filters.priceMin}`,
      });
    }
    if (filters.priceMax < 500) {
      tags.push({
        key: 'priceMax',
        value: filters.priceMax,
        label: `Max $${filters.priceMax}`,
      });
    }
    if (filters.sort !== 'newest') {
      const sortLabels = {
        best_selling: 'Best Selling',
        price_low: 'Price: Low to High',
        price_high: 'Price: High to Low',
        highest_rated: 'Highest Rated',
      };
      tags.push({
        key: 'sort',
        value: filters.sort,
        label: sortLabels[filters.sort] || filters.sort,
      });
    }
    return tags;
  }, [filters]);

  const removeFilterTag = (tag) => {
    setFilters((prev) => {
      if (tag.key === 'priceMin') return { ...prev, priceMin: 0 };
      if (tag.key === 'priceMax') return { ...prev, priceMax: 500 };
      if (tag.key === 'sort') return { ...prev, sort: 'newest' };
      return {
        ...prev,
        [tag.key]: prev[tag.key].filter((v) => v !== tag.value),
      };
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Shop', path: '/shop' }]}
        />

        <div className="flex items-center justify-between pb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-dark-900 dark:text-white">
              Shop All
            </h1>
            <p className="mt-1 text-sm text-dark-500 dark:text-gray-400">
              Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 rounded-xl border border-gray-200 p-1 sm:flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-500 text-white'
                    : 'text-dark-400 hover:text-dark-700 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-brand-500 text-white'
                    : 'text-dark-400 hover:text-dark-700 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-dark-700 hover:bg-gray-50 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {activeFilterTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-4">
            {activeFilterTags.map((tag, i) => (
              <button
                key={`${tag.key}-${tag.value}-${i}`}
                onClick={() => removeFilterTag(tag)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100"
              >
                {tag.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              onClick={handleClearFilters}
              className="text-xs font-medium text-dark-500 underline hover:text-brand-500"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8 pb-16">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobile={false}
          />

          <div className="flex-1">
            {paginatedProducts.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewMode}-${currentPage}-${filters.sort}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
                      : 'flex flex-col gap-6'
                  }
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-6">
                  <SlidersHorizontal className="h-8 w-8 text-dark-300" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-dark-900 dark:text-white">
                  No products found
                </h3>
                <p className="mb-6 text-sm text-dark-500 dark:text-gray-400">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileFilterOpen && (
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isMobile={true}
          onClose={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
}
