"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const sliderData = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    title: "Summer Collections",
    description: "Discover the latest trends in fashion with our exclusive summer collection",
    cta: "Shop Now",
  },
  {
    id: 2,
    imageUrl: "https://t3.ftcdn.net/jpg/02/41/43/18/360_F_241431868_8DFQpCcmpEPVG0UvopdztOAd4a6Rqsoo.jpg",
    title: "Electronics Sale",
    description: "Up to 40% off on all electronics and gadgets",
    cta: "View Deals",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1555529771-7888783a18d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    title: "New Arrivals",
    description: "Be the first to explore our newest products",
    cta: "Discover",
  },
  {
    id: 4,
    imageUrl: "https://c4.wallpaperflare.com/wallpaper/342/971/658/girl-street-shopping-cape-wallpaper-preview.jpg",
    title: "Free Shipping",
    description: "On all orders over $50. Limited time offer",
    cta: "Learn More",
  }
];

// Animation variants for per-letter drop
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letter: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 0.8,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

// Function to split text into animated letters
const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.div
      className={`flex flex-wrap justify-center ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={letter} className="inline-block mx-[1px] text-primary">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToNextSlide = () => setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${sliderData[currentSlide].imageUrl})` }}
        >
          <div className="absolute inset-0 bg-accent/30"></div>

          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
              <AnimatedText
                text={sliderData[currentSlide].title}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
              />
              <AnimatedText
                text={sliderData[currentSlide].description}
                className="text-lg sm:text-xl lg:text-2xl mb-10"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-accent/30 hover:bg-accent/50 text-primary p-3 rounded-full transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-accent/30 hover:bg-accent/50 text-primary p-3 rounded-full transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-primary scale-125" : "bg-primary/30"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
