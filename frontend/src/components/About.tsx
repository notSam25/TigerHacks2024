"use client"

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Zap, Lock } from 'lucide-react';

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms accurately identify ingredients and calculate nutrition facts"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get detailed nutritional information about your meal in seconds"
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Your data is encrypted and never shared with third parties"
    }
  ];

  return (
    <section id="about" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            NutriLens uses cutting-edge AI to make nutrition tracking effortless
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gray-900 p-8 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <feature.icon className="h-12 w-12 text-emerald-400 mb-6 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}