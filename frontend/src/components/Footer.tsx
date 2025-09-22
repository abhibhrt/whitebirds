import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              Whitebirds
            </Link>
            <p className="mt-4 text-gray-300">
              Your premier destination for quality fashion and accessories. We bring you the latest trends at affordable prices.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                <FaFacebookF className="text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-pink-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                <FaInstagram className="text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                <FaLinkedinIn className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/stores" className="text-gray-300 hover:text-white transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Information</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/warranty" className="text-gray-300 hover:text-white transition-colors">Warranty</Link></li>
              <li><Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/policies/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <address className="not-italic text-gray-300">
              <p className="mb-2">123 Fashion Street</p>
              <p className="mb-2">New York, NY 10001</p>
              <p className="mb-2">United States</p>
              <p className="mb-2">Email: info@whitebirds.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </address>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Opening Hours</h4>
              <p className="text-gray-300">Mon-Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-300">Sat-Sun: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Whitebirds. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/policies/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="/policies/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link href="/policies/cookie" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;