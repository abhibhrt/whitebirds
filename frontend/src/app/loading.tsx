"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed z-1000 w-screen flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            initial={{
              scale: 0,
              opacity: 0,
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, Math.random() * 0.5 + 0.5, 0],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.h1
          className="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-white via-yellow-600 to-white bg-clip-text text-transparent"
          initial={{ letterSpacing: "0.5em", backgroundPosition: "200% 50%" }}
          animate={{ letterSpacing: "0.2em", backgroundPosition: "0% 50%" }}
          transition={{
            letterSpacing: { duration: 2, ease: "easeOut" },
            backgroundPosition: {
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }, 
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          whiteb<span className="loader">&#10073;</span>rds
        </motion.h1>
      </div>
    </div>
  );
}
