"use client"

import { motion } from 'framer-motion';
import { Camera, Utensils, LineChart } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-24 pb-12 bg-gradient-to-b from-sky-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Track Your Nutrition
              <span className="block text-sky-400">With Just a Photo</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Simply snap a picture of your meal, and let AI calculate your nutrition facts instantly.
              Effortlessly track your daily intake and maintain a healthier lifestyle.
            </p>
          </motion.div>

          <div className="flex justify-center gap-8 mt-12">
            {[
              { icon: Camera, text: "Snap a Photo" },
              { icon: Utensils, text: "Get Ingredients" },
              { icon: LineChart, text: "Track Progress" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="bg-sky-900/30 p-4 rounded-full mb-3">
                  <item.icon className="h-8 w-8 text-sky-400" />
                </div>
                <span className="text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}