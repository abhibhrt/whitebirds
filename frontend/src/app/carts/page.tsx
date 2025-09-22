"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import {
  FiShoppingCart,
  FiTrash2,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { useAlert } from "@/components/Alert";
import Loading from "@/app/loading";

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  discount?: number;
  images?: { url: string }[];
}

interface CartItem {
  id: number;
  product: Product;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);
  const router = useRouter();
  const { showAlert, AlertComponent } = useAlert();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        const data = res.data as CartItem[];
        setCart(data);
      } catch (err) {
        console.error("failed to load cart", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const removeItem = async (id: number) => {
    try {
      setUpdatingItems((prev) => [...prev, id]);
      await api.delete(`/cart/${id}`);
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item", err);
    } finally {
      setUpdatingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const orderAll = async () => {
    try {
      await api.post("/cart/order-all");
      showAlert("Order placed successfully", "success");
      setCart([]);
      router.push("/orders");
    } catch (err) {
      console.error(err);
      showAlert("Could not place order", "error");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price, 0);

  const discount = cart.reduce((sum, item) => {
    const itemDiscount = item.product.discount || 0;
    return sum + (item.product.price * itemDiscount) / 100;
  }, 0);

  const total = subtotal - discount;
  const shipping = total > 0 ? 50 : 0;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pt-25 min-h-screen bg-secondary">
      <AlertComponent />
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
        <FiShoppingCart className="mr-3 text-accent" />
        Your Shopping Cart
      </h1>
      <p className="text-secondary mb-8">
        {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
      </p>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-secondary rounded-xl shadow-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-primary mb-2">
            Your cart is empty
          </h2>
          <p className="text-secondary mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 btn-primary rounded-lg transition-colors flex items-center mx-auto cursor-pointer"
          >
            Continue Shopping <FiArrowRight className="ml-2" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-secondary rounded-xl shadow-sm overflow-hidden">
              {cart.map((item: any) => {
                const isUpdating = updatingItems.includes(item.id);
                const discountedPrice = item.product.discount
                  ? item.product.price -
                    (item.product.price * item.product.discount) / 100
                  : item.product.price;

                return (
                  <div
                    key={item.id}
                    className="border-b last:border-b-0 p-4 md:p-6 transition-all hover:bg-secondary"
                  >
                    <div className="flex flex-row sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 bg-secondary rounded-lg overflow-hidden">
                          {item.product.images?.[0]?.url ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-secondary">
                              <FiShoppingCart size={24} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="font-medium text-primary text-lg mb-1">
                          {item.product.title}
                        </h3>

                        <div className="flex items-center mb-3">
                          {item.product.discount > 0 ? (
                            <>
                              <span className="text-success text-lg font-bold mr-2">
                                ₹{discountedPrice.toLocaleString()}
                              </span>
                              <span className="text-secondary line-through mr-2">
                                ₹{item.product.price.toLocaleString()}
                              </span>
                              <span className="text-white bg-error px-2 py-1 rounded-full text-xs">
                                {item.product.discount}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-success text-lg font-bold">
                              ₹{item.product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="text-secondary text-sm mb-4">
                          In stock: {item.product.stock} units
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isUpdating}
                            className="text-error p-2 disabled:opacity-50 cursor-pointer"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-secondary rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-primary">Subtotal</span>
                  <span className="font-semibold text-primary">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-success font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-primary">Shipping</span>
                  <span className="font-semibold text-primary">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="border-t pt-4 mt-2">
                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>Total</span>
                    <span>₹{(total + shipping).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={orderAll}
                className="w-full bg-accent hover:bg-accent-hover active:bg-accent-active text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
              >
                <FiCheck className="mr-2" />
                Proceed to Checkout
              </button>

              <p className="text-secondary text-xs mt-4 text-center">
                You won't be charged until the next step
              </p>
            </div>

            <button
              onClick={() => router.push("/products")}
              className="mt-4 w-full text-center text-primary font-medium flex items-center justify-center cursor-pointer"
            >
              Continue Shopping <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;