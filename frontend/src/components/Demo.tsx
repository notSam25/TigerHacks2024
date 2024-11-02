"use client"

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RefreshCw, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_KEY = 'nutriLensMetrics';

const defaultMetrics = [
  { name: 'Calories', value: 0, current: 0, max: 2000, unit: 'kcal' },
  { name: 'Total Fat', value: 0, current: 0, max: 65, unit: 'g' },
  { name: 'Cholesterol', value: 0, current: 0, max: 300, unit: 'mg' },
  { name: 'Sodium', value: 0, current: 0, max: 2300, unit: 'mg' },
  { name: 'Total Carbohydrates', value: 0, current: 0, max: 300, unit: 'g' },
  { name: 'Protein', value: 0, current: 0, max: 50, unit: 'g' }
];

export function Demo() {
  const progressSectionRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [metrics, setMetrics] = useState(() => {
    if (typeof window === 'undefined') return defaultMetrics;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultMetrics;

    try {
      const parsed = JSON.parse(saved);
      return defaultMetrics.map((defaultMetric, index) => ({
        ...defaultMetric,
        value: parsed[index]?.value ?? defaultMetric.value,
        max: parsed[index]?.max ?? defaultMetric.max
      }));
    } catch {
      return defaultMetrics;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(
      metrics.map(({ value, max }) => ({ value, max }))
    ));
  }, [metrics]);

  const [dragActive, setDragActive] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMaxChange = (index: number, value: string) => {
    const newValue = value === '' ? 0 : Math.max(0, Math.min(parseInt(value), 999999));
    if (!isNaN(newValue)) {
      setMetrics(current => current.map((metric, i) => 
        i === index ? { ...metric, max: newValue } : metric
      ));
    }
  };

  const addToDailyTotal = () => {
    setMetrics(current => current.map(metric => ({
      ...metric,
      value: Math.min(metric.value + metric.current, metric.max)
    })));
    
    progressSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const resetProgress = () => {
    setMetrics(current => current.map(metric => ({
      ...metric,
      value: 0
    })));
  };

  const preventInvalidInput = (e: { key: string; preventDefault: () => void; }) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    if (allowedKeys.includes(e.key)) return;
    if (["-", ".", "e"].includes(e.key) || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndProcessFile = async (file: File) => {
    setError(null);
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  }, []);

  const removeImage = () => {
    setImageData(null);
    setError(null);
  };

  return (
    <section id="demo" className="pt-32 pb-16 bg-black">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          className="bg-gray-900 rounded-xl p-8 mb-8"
        >
          <div 
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-sky-400 bg-sky-400/10' : 'border-gray-700'}
              ${error ? 'border-red-500' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {imageData ? (
              <div className="relative inline-block">
                <img 
                  src={imageData} 
                  alt="Uploaded food" 
                  className="max-h-64 rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-sky-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {error || 'Drag and drop your image here or click to browse'}
                </p>
                <label className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors cursor-pointer inline-block">
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </label>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Nutrition Facts</h3>
              <button 
                onClick={addToDailyTotal}
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
                  <span>{metrics[0].current} kcal</span>
                </div>
                <div className="h-[1px] bg-gray-700" />
              </div>
              <div className="space-y-6">
                {metrics.slice(1).map((metric, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-400">
                    <span>{metric.name}</span>
                    <span>{metric.current}{metric.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={progressSectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col items-center scroll-mt-8 pt-12"
        >
          <div className="w-[calc(48rem+1rem)] flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Daily Progress</h3>
              <button 
                onClick={resetProgress}
                className="flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-colors"
                title="Reset Daily Progress"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Reset Progress</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-12">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="transparent"
                        stroke="#1f2937"
                        strokeWidth="12"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="transparent"
                        stroke="#38bdf8"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - metric.value / metric.max)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl text-white font-semibold">{metric.value}</span>
                      <div className="w-16 h-[1px] bg-gray-600 my-2" />
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
                  <p className="text-gray-400 mt-3 text-base">{metric.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}