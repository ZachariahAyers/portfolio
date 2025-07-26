import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, TrendingUp, Clock, AlertCircle, CheckCircle, 
  FileText, BarChart3, Search, Gauge, Info, AlertTriangle
} from 'lucide-react';
import usePageSpeedInsights from '../../hooks/usePageSpeedInsights';
import './dashboard.css';

// Loading state component
const LoadingState = ({ message }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-4">
    <Activity className="w-8 h-8 text-blue-500 animate-spin mb-3" />
    <p className="text-sm text-gray-600 dark:text-gray-400">{message || "Fetching Lighthouse Report..."}</p>
    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This may take 20-30 seconds</p>
  </div>
);

// Performance score circle with animation
const ScoreCircle = ({ score, label, size = "large", delay = 0 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedStroke, setAnimatedStroke] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate score number
      const scoreInterval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev >= score) {
            clearInterval(scoreInterval);
            return score;
          }
          return Math.min(prev + 2, score);
        });
      }, 20);
      
      // Animate stroke
      const strokeInterval = setInterval(() => {
        setAnimatedStroke((prev) => {
          if (prev >= score) {
            clearInterval(strokeInterval);
            return score;
          }
          return Math.min(prev + 2, score);
        });
      }, 20);
      
      return () => {
        clearInterval(scoreInterval);
        clearInterval(strokeInterval);
      };
    }, delay);
    
    return () => clearTimeout(timer);
  }, [score, delay]);
  
  const radius = size === "large" ? 60 : 40;
  const strokeWidth = size === "large" ? 8 : 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedStroke / 100) * circumference;
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getStrokeColor = (score) => {
    if (score >= 90) return 'stroke-green-500';
    if (score >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="currentColor"
            className="text-gray-300 dark:text-gray-700"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            className={getStrokeColor(animatedStroke)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(animatedScore)}`}>{animatedScore}</span>
        </div>
      </div>
      {label && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{label}</p>}
    </div>
  );
};

// Core Web Vital metric card with animation
const MetricCard = ({ metric, label, value, displayValue, score, delay = 0 }) => {
  const getScoreColor = (score) => {
    if (score >= 0.9) return 'text-green-500 bg-green-500/10 border-green-500/30';
    if (score >= 0.5) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-500 bg-red-500/10 border-red-500/30';
  };

  return (
    <motion.div 
      className={`p-3 rounded-lg border ${getScoreColor(score)}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs opacity-75">{metric}</span>
      </div>
      <p className="text-lg font-bold">{displayValue}</p>
    </motion.div>
  );
};

// Animated metric box for field data
const AnimatedMetricBox = ({ label, value, unit = '', decimals = 0, delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000; // 1 second animation
      const steps = 50;
      const increment = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(interval);
        } else {
          setAnimatedValue(current);
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return (
    <motion.div 
      className="bg-gray-100/50 dark:bg-gray-800/50 p-2 rounded"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
    >
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-sm font-bold">
        {decimals > 0 ? animatedValue.toFixed(decimals) : Math.round(animatedValue)}{unit}
      </p>
    </motion.div>
  );
};

const ReleaseTab = ({ caseStudy }) => {
  const demoUrl = caseStudy.links?.demo || caseStudy.links?.github;
  const { data, loading, error, isFromCache, cacheAge, browserCacheAge } = usePageSpeedInsights(demoUrl);

  return (
    <div className="h-full relative overflow-hidden bg-black">
      {/* Background iframe - between sidebars */}
      <div className="absolute left-[320px] right-[320px] top-0 bottom-0 bg-gray-950">
        <iframe
          src={demoUrl || '#'}
          className="w-full h-full bg-white"
          title={caseStudy.hero.title}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
      
      {/* Subtle overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/05 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Left Sidebar - 3 equal sections */}
      <div className="absolute left-0 top-0 bottom-0 w-[320px] border-r border-gray-300 dark:border-blue-500/20 overflow-hidden z-30 flex flex-col">
        
        {/* System Properties - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-gray-50/90 dark:bg-gray-900/50 p-4 border-b border-gray-300 dark:border-blue-500/30"
        >
          <div className="mb-4">
            <h2 className="text-lg font-thin mb-1">Live Production Environment</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">This is the actual deployed solution running in production</p>
          </div>
          <h3 className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase mb-3">System Properties</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Environment</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-400">Production</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Analysis Status</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {loading ? 'Analyzing...' : 
                 browserCacheAge !== null ? `Browser Cache (${browserCacheAge}m ago)` :
                 isFromCache ? `Lambda Cache (${cacheAge || 0}d ago)` : 
                 'Fresh Analysis'}
              </span>
            </div>
            
            {data && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Lighthouse Version</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">{data.meta.lighthouseVersion}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Lighthouse Scores */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-gray-50/90 dark:bg-gray-900/50 p-4 border-b border-gray-300 dark:border-blue-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-mono text-orange-600 dark:text-orange-400 uppercase">Lighthouse Scores</span>
          </div>
          
          {loading && !data ? (
            <LoadingState message="Calculating scores..." />
          ) : data ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <ScoreCircle score={data.scores.performance} size="small" delay={0} />
                <p className="text-xs mt-1">Performance</p>
              </div>
              <div className="text-center">
                <ScoreCircle score={data.scores.accessibility} size="small" delay={100} />
                <p className="text-xs mt-1">Accessibility</p>
              </div>
              <div className="text-center">
                <ScoreCircle score={data.scores.bestPractices} size="small" delay={200} />
                <p className="text-xs mt-1">Best Practices</p>
              </div>
              <div className="text-center">
                <ScoreCircle score={data.scores.seo} size="small" delay={300} />
                <p className="text-xs mt-1">SEO</p>
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Core Web Vitals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-gray-50/90 dark:bg-gray-900/50 p-4 border-b border-gray-300 dark:border-blue-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase">Core Web Vitals</span>
          </div>
          
          {loading && !data ? (
            <LoadingState message="Measuring metrics..." />
          ) : data ? (
            <div className="space-y-2">
              <MetricCard 
                metric="LCP" 
                label="Largest Contentful Paint" 
                displayValue={data.coreWebVitals.lcp.displayValue}
                score={data.coreWebVitals.lcp.score}
                delay={0}
              />
              <MetricCard 
                metric="CLS" 
                label="Cumulative Layout Shift" 
                displayValue={data.coreWebVitals.cls.displayValue}
                score={data.coreWebVitals.cls.score}
                delay={150}
              />
              <MetricCard 
                metric="TBT" 
                label="Total Blocking Time" 
                displayValue={data.coreWebVitals.tbt.displayValue}
                score={data.coreWebVitals.tbt.score}
                delay={300}
              />
            </div>
          ) : null}
        </motion.div>

      </div>

      {/* Right Sidebar - 3 equal sections */}
      <div className="absolute right-0 top-0 bottom-0 w-[320px] border-l border-gray-300 dark:border-blue-500/20 overflow-hidden z-30 flex flex-col">
        
        {/* Field Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-gray-50/90 dark:bg-gray-900/50 p-4 border-b border-gray-300 dark:border-blue-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-mono text-green-600 dark:text-green-400 uppercase">Field Data</span>
          </div>
          
          {loading && !data ? (
            <LoadingState message="Loading field data..." />
          ) : data && data.fieldData.available ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Real user metrics from Chrome UX Report
              </div>
              <div className="grid grid-cols-2 gap-2">
                {data.fieldData.metrics.fcp && (
                  <AnimatedMetricBox 
                    label="FCP" 
                    value={data.fieldData.metrics.fcp} 
                    unit="ms" 
                    delay={0} 
                  />
                )}
                {data.fieldData.metrics.lcp && (
                  <AnimatedMetricBox 
                    label="LCP" 
                    value={data.fieldData.metrics.lcp} 
                    unit="ms" 
                    delay={100} 
                  />
                )}
                {data.fieldData.metrics.cls && (
                  <AnimatedMetricBox 
                    label="CLS" 
                    value={data.fieldData.metrics.cls / 100} 
                    decimals={3} 
                    delay={200} 
                  />
                )}
                {data.fieldData.metrics.fid && (
                  <AnimatedMetricBox 
                    label="FID" 
                    value={data.fieldData.metrics.fid} 
                    unit="ms" 
                    delay={300} 
                  />
                )}
              </div>
            </div>
          ) : data ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Info className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                No field data available for this origin
              </p>
            </div>
          ) : null}
        </motion.div>

        {/* Opportunities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-gray-50/90 dark:bg-gray-900/50 p-4 border-b border-gray-300 dark:border-blue-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-mono text-green-600 dark:text-green-400 uppercase">Opportunities</span>
          </div>
          
          {loading && !data ? (
            <LoadingState message="Finding optimizations..." />
          ) : data && data.opportunities.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-[200px] dashboard-scroll">
              {data.opportunities.map((opp, idx) => (
                <div key={idx} className="text-xs border-l-2 border-green-500 pl-2">
                  <p className="font-medium text-gray-700 dark:text-gray-300">{opp.title}</p>
                  <p className="text-gray-600 dark:text-gray-500">{opp.savings}</p>
                </div>
              ))}
            </div>
          ) : data ? (
            <div className="flex flex-col items-center justify-center h-full">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                No major optimization opportunities found
              </p>
            </div>
          ) : null}
        </motion.div>

        {/* Diagnostics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 bg-gray-50/90 dark:bg-gray-900/50 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-mono text-red-600 dark:text-red-400 uppercase">Diagnostics</span>
          </div>
          
          {loading && !data ? (
            <LoadingState message="Running diagnostics..." />
          ) : data && data.diagnostics.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-[200px] dashboard-scroll">
              {data.diagnostics.map((diag, idx) => (
                <div key={idx} className="text-xs border-l-2 border-yellow-500 pl-2">
                  <p className="font-medium text-gray-700 dark:text-gray-300">{diag.title}</p>
                  {diag.displayValue && (
                    <p className="text-gray-600 dark:text-gray-500">{diag.displayValue}</p>
                  )}
                </div>
              ))}
            </div>
          ) : data ? (
            <div className="flex flex-col items-center justify-center h-full">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                No diagnostic issues found
              </p>
            </div>
          ) : null}
        </motion.div>

      </div>
    </div>
  );
};

export default ReleaseTab;