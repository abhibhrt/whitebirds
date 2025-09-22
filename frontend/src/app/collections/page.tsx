"use client";

import { useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaStar,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import ProductGrid from "@/components/products/ProductGrid";

interface Image {
  id: number;
  url: string;
  isPrimary: boolean;
  productId: number;
  publicId: string;
}

interface Highlight {
  id: number;
  key: string;
  value: string;
  productId: number;
}

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  feedback: string;
  createdAt: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: string;
  sizes: string;
  delivery: number;
  shipCharge: number;
  returnable: number;
  createdAt: string;
  images: Image[];
  reviews: Review[];
  highlights: Highlight[];
}

interface RootState {
  product: {
    product: Product[];
  };
}

export default function Collections() {
  const products = useSelector(
    (state: RootState) => state.product.product
  ) || [];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [discount, setDiscount] = useState(0);
  const [rating, setRating] = useState(0);
  const [returnable, setReturnable] = useState(false);
  const [delivery, setDelivery] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? p.category === category : true;
      const matchesSize = size ? p.sizes.includes(size) : true;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesDiscount = discount ? p.discount >= discount : true;
      const avgRating =
        p.reviews?.reduce((sum, r) => sum + r.rating, 0) /
          (p.reviews?.length || 1) || 0;
      const matchesRating = rating ? avgRating >= rating : true;
      const matchesReturnable = returnable ? p.returnable : true;
      const matchesDelivery = delivery ? p.delivery <= delivery : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSize &&
        matchesPrice &&
        matchesDiscount &&
        matchesRating &&
        matchesReturnable &&
        matchesDelivery
      );
    });
  }, [products, search, category, size, priceRange, discount, rating, returnable, delivery]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSize("");
    setPriceRange([0, 5000]);
    setDiscount(0);
    setRating(0);
    setReturnable(false);
    setDelivery(0);
    searchRef.current?.focus();
  };

  const FilterSection = () => (
    <div className="bg-secondary rounded-lg shadow-sm p-6 text-primary space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2">Search</label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-accent" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-primary text-secondary"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent bg-primary text-secondary cursor-pointer"
        >
          <option value="">All Categories</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium mb-2">Size</label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full border border-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent bg-primary text-secondary cursor-pointer"
        >
          <option value="">All Sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <input
          type="range"
          min={0}
          max={20000}
          step={100}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Discount */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Minimum Discount
        </label>
        <input
          type="range"
          min={0}
          max={70}
          step={5}
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm font-medium">{discount}%</span>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">Minimum Rating</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{rating}</span>
            <FaStar className="text-accent text-xs" />
          </div>
        </div>
      </div>

      {/* Returnable */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={returnable}
            onChange={(e) => setReturnable(e.target.checked)}
            className="w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <span className="flex items-center gap-2 text-secondary">
            <FaUndo className="text-accent" />
            Returnable Only
          </span>
        </label>
      </div>

      {/* Delivery */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Max Delivery Days
        </label>
        <div className="flex items-center gap-2">
          <FaTruck className="text-accent" />
          <input
            type="number"
            placeholder="Max days"
            value={delivery || ""}
            onChange={(e) => setDelivery(Number(e.target.value))}
            className="w-full border border-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent bg-primary text-secondary"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary pt-22 pb-10 px-2 text-primary">
      <div className="lg:hidden flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-hover active:bg-primary-active"
        >
          <FaFilter />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <FilterSection />
        </div>

        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-secondary bg-opacity-50 z-40 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 30 }}
                className="fixed left-0 top-0 h-full w-80 bg-secondary z-50 overflow-y-auto lg:hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-primary-hover rounded-lg cursor-pointer"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <FilterSection />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <ProductGrid
          collections={filteredProducts}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
}