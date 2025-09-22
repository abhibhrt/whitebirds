"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaRupeeSign,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function ProductGrid({ collections, clearFilters }: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProducts = collections.slice(start, end);
  const totalPages = Math.ceil(collections.length / limit);
  const router = useRouter();

  const handleNavigate = (id: number) => {
    router.push(`/collections/${id}`);
  };

  return (
    <div className="flex-1">
      {/* Results Info */}
      <div className="bg-primary rounded-lg shadow-sm p-4 mb-6">
        <p className="text-primary">
          Showing {start + 1}-{Math.min(end, collections.length)} of{" "}
          {collections.length} products
        </p>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-primary rounded-lg shadow-sm p-4 animate-pulse"
            >
              <div className="bg-secondary h-48 rounded-lg mb-3"></div>
              <div className="h-4 bg-secondary rounded mb-2"></div>
              <div className="h-3 bg-secondary rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : paginatedProducts.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {paginatedProducts.map((product: any) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-primary rounded-lg shadow-sm overflow-hidden cursor-pointer group"
                onClick={() => handleNavigate(product.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0]?.url || "/placeholder-product.jpg"}
                    alt={product.title}
                    className="w-full h-58 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-error text-white px-2 py-1 rounded text-xs font-bold">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-primary line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-primary flex items-center">
                      <FaRupeeSign className="inline h-3 w-3" />
                      {product.price}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-secondary text-sm line-through">
                        <FaRupeeSign className="inline h-2 w-2" />
                        {Math.round(
                          product.price / (1 - product.discount / 100)
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    <FaStar />
                    <span className="text-primary text-sm">
                      {product.reviews?.length
                        ? (
                            product.reviews.reduce(
                              (sum: any, r: any) => sum + r.rating,
                              0
                            ) / product.reviews.length
                          ).toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p: any) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2 border border-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary cursor-pointer"
              >
                <FaChevronLeft />
                Previous
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg border ${
                      page === i + 1
                        ? "bg-primary text-white border-primary"
                        : "border-primary hover:bg-primary cursor-pointer"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setPage((p: any) => Math.min(p + 1, totalPages))
                }
                disabled={page === totalPages}
                className="flex items-center gap-2 px-4 py-2 border border-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary cursor-pointer"
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-primary rounded-lg shadow-sm">
          <div className="text-6xl mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486765.png"
              className="m-auto w-16"
              alt="No products"
            />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">
            No products found
          </h3>
          <p className="text-secondary">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}