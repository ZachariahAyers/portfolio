import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Zap, X } from 'lucide-react';

const ProblemTab = ({ section }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  if (!section) return null;

  const isDragging = React.useRef(false);
  
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    isDragging.current = true;
  };
  
  const handleMouseUp = () => {
    isDragging.current = false;
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="h-full p-8 flex flex-col bg-gray-200 dark:bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-thin mb-2">{section.title}</h2>
        <p className="text-gray-600 dark:text-gray-400">Drag the slider to see what I fixed - broken system on the left, my solution on the right</p>
      </motion.div>

      {/* Interactive Comparison Slider */}
      <div className="flex-1 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-gray-300 dark:border-blue-500/20 select-none"
          style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Before State */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-red-600/20 z-10">
            <div className="h-full p-12 flex flex-col justify-center">
              <div className="max-w-xl ml-[15%]">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                  <h3 className="text-2xl font-light text-red-400">{section.before.label}</h3>
                </div>
                
                <div className="space-y-4">
                  {section.before.points.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ x: 10 }}
                      onClick={() => setSelectedPoint({ type: 'before', index: idx, text: point })}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      <span className="text-lg text-gray-900 dark:text-white">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* After State */}
          <div 
            className="absolute inset-0 z-20"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            {/* Gradient overlay for opacity effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-transparent dark:from-black dark:via-gray-950/95 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/50 to-green-900/50" />
            <div className="h-full p-12 flex flex-col justify-center relative">
              <div className="max-w-xl mr-[15%] ml-auto">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                  <h3 className="text-2xl font-light text-green-400">{section.after.label}</h3>
                </div>
                
                <div className="space-y-4">
                  {section.after.points.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ x: -10 }}
                      onClick={() => setSelectedPoint({ type: 'after', index: idx, text: point })}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-lg text-gray-900 dark:text-white">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slider Handle */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 cursor-ew-resize z-30"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-blue-600/20 dark:bg-blue-400/20 rounded-full flex items-center justify-center"
              >
                <div className="w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full" />
              </motion.div>
            </div>
          </motion.div>

          {/* Visual Representation */}
          <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              
              {/* Problem waves */}
              <motion.path
                d="M0,100 Q50,50 100,100 T200,100 T300,100 T400,100"
                fill="none"
                stroke="url(#redGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Solution waves */}
              <motion.path
                d="M400,100 Q450,150 500,100 T600,100 T700,100 T800,100"
                fill="none"
                stroke="url(#greenGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </div>
        </motion.div>

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedPoint(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`
                bg-gray-100 dark:bg-gray-900 rounded-lg p-6 max-w-md w-full border
                ${selectedPoint.type === 'before' 
                  ? 'border-red-500/30' 
                  : 'border-green-500/30'
                }
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {selectedPoint.type === 'before' ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                  <h3 className="text-lg font-medium">
                    {selectedPoint.type === 'before' ? 'Problem' : 'Solution'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{selectedPoint.text}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <Zap className="w-3 h-3" />
                <span>Click anywhere to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProblemTab;