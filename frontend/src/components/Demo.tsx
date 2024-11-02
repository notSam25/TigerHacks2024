"use client"

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Upload, RefreshCw, Plus } from 'lucide-react';
import { useState } from 'react';

export function Demo() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [metrics, setMetrics] = useState([
    { name: 'Calories', value: 0, max: 2000, unit: 'kcal' },
    { name: 'Total Fat', value: 0, max: 65, unit: 'g' },
    { name: 'Cholesterol', value: 0, max: 300, unit: 'mg' },
    { name: 'Sodium', value: 0, max: 2300, unit: 'mg' },
    { name: 'Total Carbs', value: 0, max: 300, unit: 'g' },
    { name: 'Protein', value: 0, max: 50, unit: 'g' }
  ]);

  const handleMaxChange = (index: number, value: string) => {
    // Convert value to integer, validate within range, and handle empty input as 0
    const newValue = value === '' ? 0 : Math.max(0, Math.min(parseInt(value), 999999));
  
    if (!isNaN(newValue)) { // Only update if newValue is a valid number
      setMetrics(current => current.map((metric, i) => 
        i === index ? { ...metric, max: newValue } : metric
      ));
    }
  };
  
  const preventInvalidInput = (e: { key: string; preventDefault: () => void; }) => {
    // Allow backspace, delete, and arrow keys
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    
    if (allowedKeys.includes(e.key)) {
      return; // Allow these keys
    }
  
    // Prevent default behavior for invalid characters
    if (["-", ".", "e"].includes(e.key) || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  };  

  return (
    <section id="demo" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Try It Now</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload a photo of your meal to see NutriLens in action
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          className="bg-gray-900 rounded-xl p-8 mb-8"
        >
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-sky-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Drag and drop your image here or click to browse</p>
            <button className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
              Upload Image
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Ingredients List */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="bg-gray-900 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Detected Ingredients</h3>
            <div className="text-gray-400 h-[280px] overflow-y-auto">
              <p className="text-center text-gray-500 italic">No ingredients detected yet</p>
            </div>
          </motion.div>

          {/* Right Column - Nutrition Facts */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Nutrition Facts</h3>
              <button 
                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add to Daily Total</span>
              </button>
            </div>
            
            <div className="space-y-4 h-[280px]">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Calories</span>
                  <span>0 kcal</span>
                </div>
                <div className="h-[1px] bg-gray-700" />
              </div>
              <div className="space-y-6">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Total Fat</span>
                  <span>0g</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Cholesterol</span>
                  <span>0mg</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Sodium</span>
                  <span>0mg</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Total Carbohydrates</span>
                  <span>0g</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Protein</span>
                  <span>0g</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Daily Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Daily Progress</h3>
            <button 
              className="flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-colors"
              title="Reset Daily Progress"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset Progress</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="74"
                      fill="transparent"
                      stroke="#1f2937"
                      strokeWidth="8"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="74"
                      fill="transparent"
                      stroke="#38bdf8"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 74}`}
                      strokeDashoffset={`${2 * Math.PI * 74 * (1 - metric.value / metric.max)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl text-white font-semibold">{metric.value}</span>
                    <div className="w-16 h-[1px] bg-gray-600 my-1" />
                    <div className="flex items-center gap-1">
                    <input 
                    type="number" 
                    value={metric.max || ''}
                    onChange={(e) => handleMaxChange(index, e.target.value)}
                    onKeyDown={preventInvalidInput}
                    placeholder="0"
                    min="0"
                    max="999999"
                    step="1"
                    className="w-16 bg-transparent text-gray-400 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none text-center rounded text-sm"
                    title="Click to edit daily limit"
                    />
                      <span className="text-gray-500 text-sm">{metric.unit}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 mt-2">{metric.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}