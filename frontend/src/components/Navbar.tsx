"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearch,
  IoClose,
  IoMenu,
  IoPerson,
  IoCart,
  IoChevronDown,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import { useAuthStore } from "@/zustand/authStore";

interface NavItem {
  name: string;
  path: string;
  subItems?: { name: string; path: string }[];
}

const MotionLink = motion(Link);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<Record<string, boolean>>(
    {}
  );
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);

  const pathname = usePathname();
  const { openSignin } = useAuthStore();
  const user = useSelector((state: any) => state.user?.user);

  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    {
      name: "Collections",
      path: "/collections",
      subItems: [
        { name: "New Arrivals", path: "/collections/new" },
        { name: "Best Sellers", path: "/collections/best" },
        { name: "Sale Items", path: "/collections/sale" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleSearch = () => setIsSearchOpen((prev) => !prev);
  const toggleMobileSub = (name: string) =>
    setMobileSubOpen((prev) => ({ ...prev, [name]: !prev[name] }));

  const isDarkTheme = !scrolled;
  const textColor = isDarkTheme ? "text-white" : "text-gray-800";
  const hoverColor = isDarkTheme ? "hover:text-white" : "hover:text-purple-600";
  const bgColor = isDarkTheme
    ? "bg-gradient-to-r from-green-950 to-blue-950"
    : "bg-white/95 backdrop-blur-sm";
  const borderColor = isDarkTheme ? "border-white/20" : "border-gray-200";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-300 ${bgColor} ${
        scrolled ? "shadow-xl py-0 border-b " + borderColor : "py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 ${
              isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                WhiteBirds
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.subItems && setIsCollectionsHovered(true)
                }
                onMouseLeave={() =>
                  item.subItems && setIsCollectionsHovered(false)
                }
              >
                <Link
                  href={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative group flex items-center space-x-1 ${
                    pathname === item.path
                      ? isDarkTheme
                        ? "text-white bg-white/10"
                        : "text-purple-600 bg-purple-50"
                      : `${textColor} ${hoverColor}`
                  }`}
                >
                  <span>{item.name}</span>
                  {item.subItems && (
                    <motion.div
                      animate={{ rotate: isCollectionsHovered ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IoChevronDown className="w-4 h-4" />
                    </motion.div>
                  )}
                  <span
                    className={`absolute -bottom-1 left-4 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-8 ${
                      pathname === item.path ? "w-8" : ""
                    }`}
                  ></span>
                </Link>

                {/* Dropdown Menu */}
                {item.subItems && isCollectionsHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full left-0 mt-2 w-48 rounded-xl shadow-2xl border ${
                      isDarkTheme
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.path}
                        className={`block px-4 py-3 text-sm font-medium transition-all duration-200 border-b ${
                          isDarkTheme
                            ? "border-gray-800 hover:bg-gray-800 text-gray-200"
                            : "border-gray-100 hover:bg-purple-50 text-gray-700"
                        } last:border-b-0`}
                        onClick={() => setIsCollectionsHovered(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="flex items-center">
              <AnimatePresence mode="wait">
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      className={`w-full pl-4 pr-10 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border ${
                        isDarkTheme
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={toggleSearch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2.5 rounded-full transition-all duration-200 ml-2 cursor-pointer ${
                  isDarkTheme
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {isSearchOpen ? (
                  <IoClose className="h-5 w-5" />
                ) : (
                  <IoSearch className="h-5 w-5" />
                )}
              </motion.button>
            </div>

            {/* Auth & Cart */}
            <div className="flex items-center space-x-2">
              {!user ? (
                <motion.button
                  onClick={openSignin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Sign In
                </motion.button>
              ) : (
                <>
                  <MotionLink
                    href="/carts"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2.5 rounded-full relative transition-all duration-200 ${
                      isDarkTheme ? "hover:bg-white/10" : "hover:bg-gray-100"
                    }`}
                  >
                    <IoCart className={`h-6 w-6 ${textColor}`} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                      3
                    </span>
                  </MotionLink>

                  <MotionLink
                    href="/profile"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2.5 rounded-full transition-all duration-200 ${
                      isDarkTheme ? "hover:bg-white/10" : "hover:bg-gray-100"
                    }`}
                  >
                    <IoPerson className={`h-6 w-6 ${textColor}`} />
                  </MotionLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              className={`md:hidden p-2.5 rounded-full transition-all duration-200 ${
                isDarkTheme ? "hover:bg-white/10" : "hover:bg-gray-100"
              }`}
            >
              {!isOpen ? (
                <IoMenu className={`h-6 w-6 ${textColor}`} />
              ) : (
                <IoClose className={`h-6 w-6 ${textColor}`} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden border-t ${borderColor} ${
              isDarkTheme ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() =>
                      item.subItems
                        ? toggleMobileSub(item.name)
                        : setIsOpen(false)
                    }
                    className={`w-full text-left flex justify-between items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      pathname === item.path
                        ? isDarkTheme
                          ? "bg-white/10 text-white"
                          : "bg-purple-50 text-purple-600"
                        : isDarkTheme
                        ? "text-gray-200 hover:bg-white/5"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                    {item.subItems && (
                      <IoChevronDown
                        className={`w-4 h-4 transform ${
                          mobileSubOpen[item.name] ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {item.subItems && mobileSubOpen[item.name] && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.path}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isDarkTheme
                              ? "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
