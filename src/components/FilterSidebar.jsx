import { useState } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['Running', 'Casual', 'Sports', 'Lifestyle', 'Outdoor', 'Kids'];
const GENDERS = ['Men', 'Women', 'Kids', 'Unisex'];
const SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];
const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Brown', hex: '#A16207' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Navy', hex: '#1E3A5F' },
];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'best_selling', label: 'Best Selling' },
  { value: 'price_low', label: 'Price Low to High' },
  { value: 'price_high', label: 'Price High to Low' },
  { value: 'highest_rated', label: 'Highest Rated' },
];

function FilterSection({ title, count, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
        type="button"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-medium text-white">
              {count}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'mt-3 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  onClose,
}) {
  const [expandedSections, setExpandedSections] = useState({});

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.genders.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 500 ||
    filters.sort !== 'newest';

  const activeCount =
    filters.categories.length +
    filters.genders.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.priceMin > 0 || filters.priceMax < 500 ? 1 : 0) +
    (filters.sort !== 'newest' ? 1 : 0);

  const toggleArrayFilter = (key, value) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const handlePriceChange = (key, value) => {
    const num = value === '' ? 0 : Number(value);
    onFilterChange({ ...filters, [key]: num });
  };

  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sort: value });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {isMobile && (
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gray-900" />
            <span className="text-lg font-semibold text-gray-900">Filters</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        {hasActiveFilters && (
          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Active Filters</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-medium text-white">
                {activeCount}
              </span>
            </div>
            <button
              onClick={onClearFilters}
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
              type="button"
            >
              Clear All
            </button>
          </div>
        )}

        <FilterSection title="Category" count={filters.categories.length}>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-3 group"
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                    filters.categories.includes(cat)
                      ? 'border-brand-500 bg-brand-500'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}
                >
                  {filters.categories.includes(cat) && (
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Gender" count={filters.genders.length}>
          <div className="space-y-2">
            {GENDERS.map((gender) => (
              <label
                key={gender}
                className="flex cursor-pointer items-center gap-3 group"
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                    filters.genders.includes(gender)
                      ? 'border-brand-500 bg-brand-500'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}
                >
                  {filters.genders.includes(gender) && (
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {gender}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Size" count={filters.sizes.length}>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleArrayFilter('sizes', size)}
                className={`rounded-lg border px-2 py-1.5 text-sm font-medium transition-all ${
                  filters.sizes.includes(size)
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Color" count={filters.colors.length}>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => {
              const isActive = filters.colors.includes(color.hex);
              const isLight = ['#FFFFFF', '#EAB308', '#F97316'].includes(color.hex);
              return (
                <button
                  key={color.hex}
                  onClick={() => toggleArrayFilter('colors', color.hex)}
                  className={`relative h-8 w-8 rounded-full transition-all ${
                    isActive ? 'ring-2 ring-brand-500 ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  type="button"
                >
                  {isLight && (
                    <span className="absolute inset-0 rounded-full border border-gray-200" />
                  )}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection
          title="Price Range"
          count={filters.priceMin > 0 || filters.priceMax < 500 ? 1 : 0}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-gray-500">Min Price</label>
                <input
                  type="number"
                  min={0}
                  max={filters.priceMax}
                  value={filters.priceMin || ''}
                  onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <span className="mt-4 text-gray-400">-</span>
              <div className="flex-1">
                <label className="mb-1 block text-xs text-gray-500">Max Price</label>
                <input
                  type="number"
                  min={filters.priceMin}
                  max={500}
                  value={filters.priceMax || ''}
                  onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                  placeholder="500"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              value={filters.priceMax}
              onChange={(e) => handlePriceChange('priceMax', e.target.value)}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>${filters.priceMin || 0}</span>
              <span>${filters.priceMax || 500}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Sort By" count={filters.sort !== 'newest' ? 1 : 0}>
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 group"
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                    filters.sort === option.value
                      ? 'border-brand-500'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}
                >
                  {filters.sort === option.value && (
                    <div className="h-2 w-2 rounded-full bg-brand-500" />
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative z-10 h-full w-full max-w-sm animate-[slideInLeft_0.3s_ease-out]">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <aside className="sticky top-24 hidden w-64 flex-shrink-0 lg:block">
      {sidebarContent}
    </aside>
  );
}
