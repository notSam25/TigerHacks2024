import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface ResetButtonsProps {
  hasNonDefaultMax: boolean;
  onResetMaxValues: () => void;
  onResetProgress: () => void;
}

export function ResetButtons({ 
  hasNonDefaultMax, 
  onResetMaxValues, 
  onResetProgress 
}: ResetButtonsProps) {
  return (
    <div className="flex items-center gap-4">
      <AnimatePresence>
        {hasNonDefaultMax && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            onClick={onResetMaxValues}
            className="flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-colors"
            title="Reset Max Values to Default"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reset Limits</span>
          </motion.button>
        )}
      </AnimatePresence>
      <button 
        onClick={onResetProgress}
        className="flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-colors"
        title="Reset Daily Progress"
      >
        <RefreshCw className="h-5 w-5" />
        <span>Reset Progress</span>
      </button>
    </div>
  );
}