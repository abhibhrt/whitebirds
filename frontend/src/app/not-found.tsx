"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaHome, FaExclamationTriangle } from "react-icons/fa"; // Removed FaShoppingBag

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary px-4 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-9xl font-bold text-primary opacity-20 absolute left-1/2 transform -translate-x-1/2 -z-10"
          >
            404
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="text-6xl font-bold text-primary mb-4 flex justify-center items-center"
          >
            <FaExclamationTriangle className="mr-4 text-accent" />
            404
          </motion.div>
        </div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-primary mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-secondary mb-8 max-w-md mx-auto"
        >
          Oops! The page you&apos;re looking for seems to have flown away. Let&apos;s help you find your way back to our nest.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-lg transition-colors w-full sm:w-auto cursor-pointer"
            >
              <FaHome />
              Go Home
            </motion.button>
          </Link>
        </motion.div>
        
        {/* Popular Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center"
        >
          <p className="text-secondary mb-4">Popular Pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="text-primary hover:underline">Products</Link>
            <Link href="/categories" className="text-primary hover:underline">Categories</Link>
            <Link href="/deals" className="text-primary hover:underline">Deals</Link>
            <Link href="/about" className="text-primary hover:underline">About Us</Link>
            <Link href="/contact" className="text-primary hover:underline">Contact</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}