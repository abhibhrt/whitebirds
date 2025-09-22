"use client";

import React, { useState } from "react";
import Reviews from "@/components/reviews/Reviews";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiRefreshCw,
  FiCheck,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import NotFound from "@/app/not-found";
import api from "@/utils/axios";
import { useAlert } from "@/components/Alert";
import Image from "next/image";

interface Highlight {
  id: number;
  key: string;
  value: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  discount: number;
  description: string;
  stock: number;
  images: { url: string }[];
  reviews: Review[];
  highlights?: Highlight[];
  shipCharge: number;
  delivery: number;
  returnable: number;
}

const ProductDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id, 10);

  const products: Product[] =
    useSelector((state: { product: { product: Product[] } }) => state.product.product) || [];
  const product = products.find((p) => p.id === productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { showAlert, AlertComponent } = useAlert();

  if (!product) return <NotFound />;

  const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);

  const reviewCount = product.reviews.length;
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const handleImageChange = (index: number) => setSelectedImage(index);
  const nextImage = () =>
    setSelectedImage((prev) => (prev + 1) % (product.images?.length || 1));
  const prevImage = () =>
    setSelectedImage(
      (prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1)
    );
  const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, product.stock));
  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const addToCart = async () => {
    try {
      await api.post("/cart", { productId: product.id });
      showAlert("Added to cart", "success");
    } catch (err: any) {
      showAlert(err?.response?.data?.error || "Error adding to cart", "warning");
    }
  };

  const buyNow = () => alert(`Proceeding to buy ${quantity} ${product.title}!`);

  return (
    <div className="mx-auto p-4 pt-24 bg-primary text-primary">
      <AlertComponent />

      <div className="text-sm text-secondary mb-6">
        Home / Products /{" "}
        <span className="text-primary font-semibold">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative">
          <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-md bg-secondary">
            {product.images?.[selectedImage]?.url && (
              <Image
                src={product.images[selectedImage].url}
                alt={product.title}
                width={500}
                height={500}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            )}

            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary p-2 rounded-full shadow-md hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  <FiChevronLeft className="text-secondary" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary p-2 rounded-full shadow-md hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  <FiChevronRight className="text-secondary" />
                </button>
              </>
            )}

            <button className="absolute top-4 right-4 bg-accent p-2 rounded-full shadow-md hover:bg-accent-hover transition-colors cursor-pointer">
              <FiHeart className="text-primary hover:text-primary-hover" />
            </button>

            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-error text-white px-3 py-1 rounded-full text-sm font-bold">
                {product.discount}% OFF
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex mt-4 space-x-3 overflow-x-auto py-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`h-20 w-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === index ? "border-primary" : "border-secondary"
                  }`}
                  onClick={() => handleImageChange(index)}
                >
                  <Image
                    src={img.url}
                    alt={`${product.title} view ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center mt-2">
            <div className="flex text-accent">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`${i < averageRating ? "fill-current" : ""}`} />
              ))}
            </div>
            <span className="ml-2 text-secondary">{reviewCount} reviews</span>
          </div>

          <p className="text-secondary mt-4 leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <div className="flex items-end">
              <span className="text-success text-3xl font-bold">₹{discountedPrice.toLocaleString()}</span>
              <span className="text-primary text-xl line-through ml-3">₹{product.price.toLocaleString()}</span>
              <span className="ml-4 px-2 py-1 bg-success text-white text-sm font-semibold rounded">
                You save ₹{(product.price - discountedPrice).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6">
            <p className="text-secondary text-sm font-medium">Quantity</p>
            <div className="flex items-center mt-2">
              <button
                onClick={decreaseQuantity}
                className="p-2 border border-primary rounded-l-md hover:bg-primary-hover cursor-pointer text-primary"
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="px-4 py-2 border-t border-b border-primary text-primary">{quantity}</div>
              <button
                onClick={increaseQuantity}
                className="p-2 border border-primary rounded-r-md hover:bg-primary-hover cursor-pointer text-primary"
                disabled={quantity >= product.stock}
              >
                +
              </button>
              <span className="ml-4 text-secondary">{product.stock} available</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={addToCart}
              className="flex items-center justify-center gap-2 px-6 py-3 btn-primary flex-1 shadow-md cursor-pointer"
            >
              <FiShoppingCart className="text-lg" />
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover active:bg-accent-active text-white rounded-md transition-colors shadow-md flex-1 cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery & Return Info */}
          <div className="mt-8 border-t border-primary pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiTruck className="text-2xl text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-primary">
                    {product.shipCharge > 0
                      ? `Delivery Charge: ₹${product.shipCharge.toLocaleString()}`
                      : "Free Delivery"}
                  </h3>
                  <p className="text-secondary text-sm">Delivery in {product.delivery} days</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiRefreshCw
                  className={`text-2xl mt-1 mr-3 ${
                    product.returnable > 0 ? "text-success" : "text-error"
                  }`}
                />
                <div>
                  <h3 className="font-semibold text-primary">
                    {product.returnable > 0 ? "Easy Returns" : "No Return"}
                  </h3>
                  <p className="text-secondary text-sm">
                    {product.returnable > 0
                      ? `Returnable within ${product.returnable} days`
                      : "This product is not returnable"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          {product.highlights?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3 text-primary">Product Highlights</h3>
              <ul className="space-y-2">
                {product.highlights.map((h) => (
                  <li key={h.id} className="flex items-start">
                    <FiCheck className="text-success mt-1 mr-2 flex-shrink-0" />
                    <span className="text-primary">
                      <span className="font-medium">{h.key}:</span> {h.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Component */}
      <div className="mt-12">
        <Reviews reviews={product.reviews} />
      </div>
    </div>
  );
};

export default ProductDetails;