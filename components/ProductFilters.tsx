'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface ProductFiltersProps {
  minPrice: number;
  maxPrice: number;
}

export default function ProductFilters({ minPrice, maxPrice }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState({
    min: Number(searchParams.get('minPrice')) || minPrice,
    max: Number(searchParams.get('maxPrice')) || maxPrice,
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [showFilters, setShowFilters] = useState(false);

  // Update URL with filters
  const updateFilters = (updates: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === false || value === minPrice && key === 'minPrice' || value === maxPrice && key === 'maxPrice') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchQuery });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    updateFilters({ minPrice: priceRange.min, maxPrice: priceRange.max });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sort: value });
  };

  const toggleInStock = () => {
    const newValue = !inStockOnly;
    setInStockOnly(newValue);
    updateFilters({ inStock: newValue });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: minPrice, max: maxPrice });
    setSortBy('newest');
    setInStockOnly(false);
    router.push(pathname);
  };

  const hasActiveFilters =
    searchQuery ||
    priceRange.min !== minPrice ||
    priceRange.max !== maxPrice ||
    sortBy !== 'newest' ||
    inStockOnly;

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white cursor-pointer min-w-[200px]"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>

        {/* Filter Toggle Button (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Price Range Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                  min={minPrice}
                  max={priceRange.max}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <span className="text-gray-400">—</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                  min={priceRange.min}
                  max={maxPrice}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                onClick={applyPriceFilter}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </div>
          </div>

          {/* In Stock Filter */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={toggleInStock}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">In Stock Only</span>
            </label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
