"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

interface ProductImage {
  url: string;
  isPrimary: boolean;
}

interface Product {
  id: number;
  title: string;
  price: number;
  discount: number;
  images: ProductImage[];
}

export default function HomeProducts() {
  const allProducts = useSelector((state: RootState) => state.product.product) || [];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();

  // Memoize allProducts to avoid unnecessary re-renders
  const memoProducts: Product[] = useMemo<Product[]>(() => allProducts, [allProducts]);

  useEffect(() => {
    if (memoProducts.length > 0) {
      setProducts(memoProducts.slice(0, 4));
    }
  }, [memoProducts]);

  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore || memoProducts.length === 0) return;
    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * 4;
      const newProducts = memoProducts.slice(startIndex, startIndex + 4);

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
      }

      setLoading(false);
    }, 1000);
  }, [loading, hasMore, page, memoProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, loadMoreProducts]);

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  return (
    <div className="bg-primary container mx-auto py-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const primaryImage =
            product.images.find((img) => img.isPrimary)?.url ||
            product.images[0]?.url ||
            "/placeholder.jpg";

          return (
            <div
              onClick={() => router.push(`/collections/${product.id}`)}
              key={product.id}
              className="cursor-pointer overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 rounded-2xl bg-primary shadow"
            >
              <div className="relative w-full h-56">
                <img
                  src={primaryImage}
                  alt={product.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-1 line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price * (1 - product.discount / 100))}
                    </span>
                    <span className="ml-2 text-sm text-secondary line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="flex items-center mt-2">
                    <div className="flex text-accent">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-secondary">(42)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div id="sentinel" className="h-10 my-4 flex justify-center">
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-primary">Loading more...</span>
          </div>
        )}
      </div>

      {!hasMore && memoProducts.length > 0 && (
        <div className="text-center py-2 text-secondary">
          You&apos;ve reached the end of products
        </div>
      )}
    </div>
  );
}
