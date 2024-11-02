"use client"
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

export function Navbar() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer"
            onClick={scrollToTop}
          >
            <Camera className="h-8 w-8 text-sky-400" />
            <span className="ml-2 text-xl font-bold text-white">NutriLens</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block"
          >
            <div className="flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#demo" className="text-gray-300 hover:text-white transition-colors">
                Try It Now
              </a>
              <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors">
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}