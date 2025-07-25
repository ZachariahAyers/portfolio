import React from 'react';
import { TrendingUp, Users, Clock, Zap } from 'lucide-react';

const CaseStudyMetrics = ({ metrics }) => {
  if (!metrics) return null;

  const getMetricIcon = (key) => {
    const icons = {
      developmentTime: Clock,
      performance: Zap,
      adoption: Users,
      default: TrendingUp
    };
    return icons[key] || icons.default;
  };

  const getMetricColor = (index) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-amber-500 to-orange-500'
    ];
    return colors[index % colors.length];
  };

  const metricEntries = Object.entries(metrics);

  return (
    <section className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricEntries.map(([key, metric], index) => {
              const Icon = getMetricIcon(key);
              const gradientColor = getMetricColor(index);
              
              return (
                <div 
                  key={key}
                  className="relative bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Background Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientColor} opacity-10 dark:opacity-20 rounded-full transform translate-x-16 -translate-y-16`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-8 h-8 text-gray-600 dark:text-gray-400`} />
                      <span className={`text-3xl font-bold bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
                        {metric.value}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {metric.label}
                    </h3>
                    {metric.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyMetrics;