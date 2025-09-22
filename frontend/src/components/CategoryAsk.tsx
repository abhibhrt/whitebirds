"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Props {
  onSelect: (category: "men" | "women") => void;
}

const CategoryAsk = ({ onSelect }: Props) => {
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const savedCategory = localStorage.getItem("category");
    if (!savedCategory) {
      const timer = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelect = (category: "men" | "women") => {
    setIsExiting(true);

    setTimeout(() => {
      localStorage.setItem("category", category);
      setShow(false);
      onSelect(category);
      setIsExiting(false);
    }, 800);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center z-50 px-4"
        >
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="text-3xl md:text-5xl font-bold mb-8 text-center"
          >
            WELCOME TO WHITEBIRDS
          </motion.h1>

          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
            className="text-xl md:text-2xl mb-12 text-center"
          >
            Who are you shopping for today?
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {[
              {
                category: "men" as const,
                label: "MEN",
                subtitle: "Fashion for gentlemen",
                img: "https://img.freepik.com/free-photo/young-sensitive-man-thinking_23-2149459724.jpg?semt=ais_hybrid&w=740&q=80",
                bgColor: "blue-500",
              },
              {
                category: "women" as const,
                label: "WOMEN",
                subtitle: "Fashion for ladies",
                img: "https://images.pexels.com/photos/2916814/pexels-photo-2916814.jpeg?cs=srgb&dl=pexels-vanyaoboleninov-2916814.jpg&fm=jpg",
                bgColor: "pink-500",
              },
            ].map((item, idx) => (
              <motion.button
                key={item.category}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + idx * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(item.category)}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 w-64 md:w-80 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-t from-${item.bgColor}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="w-full h-64 overflow-hidden rounded-lg mb-4 relative"
                  >
                    <Image
                      src={item.img}
                      alt={item.label}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 + idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="font-bold text-xl mb-1">{item.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</div>
                  </motion.div>
                </div>

                {isExiting && (
                  <motion.div
                    className={`absolute inset-0 bg-${item.bgColor} opacity-0 rounded-2xl`}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12 text-center text-gray-500 dark:text-gray-400"
          >
            <p>Your preference will be saved for future visits</p>
            <p className="text-sm mt-1">(You can change this later in your profile)</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryAsk;