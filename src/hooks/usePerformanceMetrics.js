import { useState, useEffect, useRef } from 'react';

const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    navigation: {
      loadTime: 0,
      domContentLoaded: 0,
      firstByte: 0,
      dnsLookup: 0,
      tcpConnection: 0,
      tlsNegotiation: 0,
      requestTime: 0,
      responseTime: 0
    },
    resources: {
      total: 0,
      byType: {
        script: { count: 0, size: 0, duration: 0 },
        stylesheet: { count: 0, size: 0, duration: 0 },
        image: { count: 0, size: 0, duration: 0 },
        font: { count: 0, size: 0, duration: 0 },
        xhr: { count: 0, size: 0, duration: 0 },
        other: { count: 0, size: 0, duration: 0 }
      },
      slowest: [],
      totalSize: 0,
      totalDuration: 0
    },
    paint: {
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0
    },
    memory: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      usagePercentage: 0
    },
    timeline: []
  });

  const observerRef = useRef(null);
  const timelineRef = useRef([]);

  useEffect(() => {
    const processNavigationTiming = () => {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        setMetrics(prev => ({
          ...prev,
          navigation: {
            loadTime: Math.round(nav.loadEventEnd - nav.fetchStart),
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.fetchStart),
            firstByte: Math.round(nav.responseStart - nav.fetchStart),
            dnsLookup: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
            tcpConnection: Math.round(nav.connectEnd - nav.connectStart),
            tlsNegotiation: nav.secureConnectionStart > 0 ? Math.round(nav.connectEnd - nav.secureConnectionStart) : 0,
            requestTime: Math.round(nav.responseStart - nav.requestStart),
            responseTime: Math.round(nav.responseEnd - nav.responseStart)
          }
        }));
      }
    };

    const processResourceTiming = () => {
      const resources = performance.getEntriesByType('resource');
      const byType = {
        script: { count: 0, size: 0, duration: 0 },
        stylesheet: { count: 0, size: 0, duration: 0 },
        image: { count: 0, size: 0, duration: 0 },
        font: { count: 0, size: 0, duration: 0 },
        xhr: { count: 0, size: 0, duration: 0 },
        other: { count: 0, size: 0, duration: 0 }
      };

      let totalSize = 0;
      let totalDuration = 0;

      resources.forEach(resource => {
        const type = getResourceType(resource);
        const category = byType[type] || byType.other;
        
        category.count++;
        category.size += resource.transferSize || 0;
        category.duration += resource.duration || 0;
        
        totalSize += resource.transferSize || 0;
        totalDuration += resource.duration || 0;
      });

      // Get slowest resources
      const slowest = resources
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
        .map(r => ({
          name: r.name.split('/').pop() || r.name,
          duration: Math.round(r.duration),
          size: r.transferSize || 0,
          type: getResourceType(r)
        }));

      setMetrics(prev => ({
        ...prev,
        resources: {
          total: resources.length,
          byType,
          slowest,
          totalSize,
          totalDuration: Math.round(totalDuration / resources.length) || 0
        }
      }));
    };

    const processPaintTiming = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const paintMetrics = {
        firstPaint: 0,
        firstContentfulPaint: 0
      };

      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          paintMetrics.firstPaint = Math.round(entry.startTime);
        } else if (entry.name === 'first-contentful-paint') {
          paintMetrics.firstContentfulPaint = Math.round(entry.startTime);
        }
      });

      // Try to get LCP from PerformanceObserver
      if (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            setMetrics(prev => ({
              ...prev,
              paint: {
                ...prev.paint,
                largestContentfulPaint: Math.round(lastEntry.startTime)
              }
            }));
          }
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.log('LCP not supported');
        }
      }

      setMetrics(prev => ({
        ...prev,
        paint: {
          ...prev.paint,
          ...paintMetrics
        }
      }));
    };

    const processMemoryInfo = () => {
      if (performance.memory) {
        const used = performance.memory.usedJSHeapSize;
        const total = performance.memory.totalJSHeapSize;
        const limit = performance.memory.jsHeapSizeLimit;
        
        setMetrics(prev => ({
          ...prev,
          memory: {
            usedJSHeapSize: used,
            totalJSHeapSize: total,
            jsHeapSizeLimit: limit,
            usagePercentage: Math.round((used / limit) * 100)
          }
        }));
      }
    };

    const getResourceType = (resource) => {
      const name = resource.name.toLowerCase();
      if (resource.initiatorType === 'script' || name.endsWith('.js')) return 'script';
      if (resource.initiatorType === 'css' || name.endsWith('.css')) return 'stylesheet';
      if (resource.initiatorType === 'img' || /\.(jpg|jpeg|png|gif|svg|webp)/.test(name)) return 'image';
      if (/\.(woff|woff2|ttf|otf|eot)/.test(name)) return 'font';
      if (resource.initiatorType === 'xmlhttprequest' || resource.initiatorType === 'fetch') return 'xhr';
      return 'other';
    };

    // Set up Performance Observer
    const setupPerformanceObserver = () => {
      if ('PerformanceObserver' in window) {
        observerRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach(entry => {
            // Add to timeline
            const timelineEntry = {
              type: entry.entryType,
              name: entry.name,
              startTime: Math.round(entry.startTime),
              duration: Math.round(entry.duration || 0),
              timestamp: Date.now()
            };
            
            timelineRef.current = [...timelineRef.current.slice(-50), timelineEntry];
            
            setMetrics(prev => ({
              ...prev,
              timeline: timelineRef.current
            }));
          });

          // Reprocess metrics when new entries arrive
          processResourceTiming();
          processPaintTiming();
          processMemoryInfo();
        });

        // Observe multiple entry types
        const entryTypes = ['navigation', 'resource', 'paint', 'measure', 'mark'];
        const supportedTypes = entryTypes.filter(type => 
          PerformanceObserver.supportedEntryTypes?.includes(type)
        );
        
        if (supportedTypes.length > 0) {
          observerRef.current.observe({ 
            entryTypes: supportedTypes,
            buffered: true 
          });
        }
      }
    };

    // Initial capture
    processNavigationTiming();
    processResourceTiming();
    processPaintTiming();
    processMemoryInfo();
    setupPerformanceObserver();

    // Periodic memory updates
    const memoryInterval = setInterval(processMemoryInfo, 2000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(memoryInterval);
    };
  }, []);

  return metrics;
};

export default usePerformanceMetrics;