"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShoppingBag, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTruck, 
  FaUndo, 
  FaRupeeSign,
  FaInfoCircle
} from "react-icons/fa";
import api from "@/utils/axios";

type Product = {
  id: number;
  title: string;
  price: number;
  discount: number | null;
  images: { url: string }[];
};

type Order = {
  id: number;
  productId: number;
  quantity: number;
  expected: string;
  total: number;
  paymentMode: string;
  status: string;
  createdAt: string;
  product: Product;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "delivered">("active");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (id: number) => {
    setCancellingId(id);
    try {
      await api.put(`/orders/${id}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const activeOrders = orders.filter(
    (o) => !["Delivered", "Cancelled"].includes(o.status)
  );
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled");

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return <FaClock className="text-accent" />;
      case "shipped": return <FaTruck className="text-accent" />;
      case "delivered": return <FaCheckCircle className="text-accent" />;
      case "cancelled": return <FaTimesCircle className="text-accent" />;
      default: return <FaInfoCircle className="text-secondary" />;
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-secondary rounded-2xl shadow-sm p-2 mb-6 bg-primary hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-lg bg-secondary overflow-hidden">
            {order.product.images.length > 0 ? (
              <img 
                src={order.product.images[0].url} 
                alt={order.product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-secondary">
                <FaShoppingBag className="text-2xl" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h3 className="text-lg font-semibold text-primary line-clamp-2">
                {order.product.title}
              </h3>
              <p className="text-secondary mt-1">
                Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
              <p className="text-secondary">
                Expected delivery: {new Date(order.expected).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-accent">
              {getStatusIcon(order.status)}
              <span className="text-accent">
                {order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-secondary">
            <div>
              Quantity: <span className="font-medium text-primary ml-1">{order.quantity}</span>
            </div>
            <div>
              Total: <span className="font-medium text-primary ml-1 flex items-center">
                <FaRupeeSign className="inline h-3 w-3" />{order.total.toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              Payment: <span className="font-medium text-primary ml-1">{order.paymentMode}</span>
            </div>
          </div>

          {["pending", "shipped"].includes(order.status.toLowerCase()) && (
            <div className="mt-2">
              <button
                onClick={() => cancelOrder(order.id)}
                disabled={cancellingId === order.id}
                className="flex items-center gap-2 text-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer px-2 py-1 rounded"
              >
                {cancellingId === order.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <FaUndo className="inline" />
                    Cancel Order
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 bg-primary">
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-8 bg-secondary rounded w-1/3"></div>
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-2xl shadow-sm p-6 bg-primary flex gap-6">
              <div className="h-24 w-24 bg-secondary rounded-lg"></div>
              <div className="flex-grow space-y-3">
                <div className="h-6 bg-secondary rounded w-3/4"></div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
                <div className="h-4 bg-secondary rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-y-scroll pt-2 pb-10 px-4 bg-primary rounded-2xl">
      <div className="mx-auto">
        <div className="flex border-b border-secondary mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "active"
                ? "text-primary border-b-2 border-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            Active Orders ({activeOrders.length + cancelledOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "delivered"
                ? "text-primary border-b-2 border-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            Delivered ({deliveredOrders.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "active" ? (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {activeOrders.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <FaClock className="text-accent" />
                    Active Orders
                  </h2>
                  {activeOrders.map((order) => <OrderCard key={order.id} order={order} />)}
                </section>
              )}

              {cancelledOrders.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <FaTimesCircle className="text-accent" />
                    Cancelled Orders
                  </h2>
                  {cancelledOrders.map((order) => <OrderCard key={order.id} order={order} />)}
                </section>
              )}

              {activeOrders.length === 0 && cancelledOrders.length === 0 && (
                <div className="text-center py-12 bg-primary rounded-2xl shadow-sm">
                  <FaShoppingBag className="text-4xl text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary mb-2">
                    No active orders
                  </h3>
                  <p className="text-secondary">
                    You haven&apos;t placed any orders yet.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="delivered" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {deliveredOrders.length > 0 ? (
                <section>
                  <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-accent" />
                    Delivered Orders
                  </h2>
                  {deliveredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
                </section>
              ) : (
                <div className="text-center py-12 bg-primary rounded-2xl shadow-sm">
                  <FaCheckCircle className="text-4xl text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary mb-2">
                    No delivered orders
                  </h3>
                  <p className="text-secondary">
                    Your delivered orders will appear here.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}