import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Users, TrendingUp, AlertCircle, Cpu, Database, Network, Shield,
  Zap, Server
} from 'lucide-react';
import './dashboard.css';

const ReleaseTab = ({ caseStudy }) => {
  // Animated counter state - Initialize with base values
  const [visitors, setVisitors] = useState(1247);
  const [responseTime, setResponseTime] = useState(234);
  const [apiCalls, setApiCalls] = useState(8942);
  const [errorCount, setErrorCount] = useState(3);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [memoryUsage, setMemoryUsage] = useState(68);
  const [uptime, setUptime] = useState(99.99);
  
  // Historical data for smooth animations
  const [historicalVisitors, setHistoricalVisitors] = useState([]);
  const [historicalResponse, setHistoricalResponse] = useState([]);
  const [historicalAPI, setHistoricalAPI] = useState([]);
  
  // Initialize historical data
  useEffect(() => {
    const initVisitors = Array.from({ length: 300 }, (_, i) => 
      1200 + Math.sin(i * 0.05) * 100 + Math.random() * 50
    );
    const initResponse = Array.from({ length: 300 }, (_, i) => 
      200 + Math.sin(i * 0.02) * 50 + Math.random() * 20
    );
    const initAPI = Array.from({ length: 300 }, (_, i) => 
      8000 + i * 3 + Math.random() * 100
    );
    
    setHistoricalVisitors(initVisitors);
    setHistoricalResponse(initResponse);
    setHistoricalAPI(initAPI);
  }, []);
  
  // Smooth incremental updates - like task manager
  useEffect(() => {
    const interval = setInterval(() => {
      // Visitors - smooth wave pattern with small random variations
      setVisitors(prev => {
        const base = 1247;
        const time = Date.now() / 1000;
        const wave = Math.sin(time * 0.1) * 50;
        const noise = (Math.random() - 0.5) * 10;
        return Math.round(base + wave + noise);
      });
      
      // Response time - gradual changes
      setResponseTime(prev => {
        const delta = (Math.random() - 0.5) * 2;
        const newValue = prev + delta;
        return Math.max(100, Math.min(500, Math.round(newValue)));
      });
      
      // API calls - steady increase with occasional jumps
      setApiCalls(prev => {
        const increment = Math.random() < 0.9 ? Math.random() * 5 : Math.random() * 50;
        return Math.round(prev + increment);
      });
      
      // Error count - rare occurrences
      setErrorCount(prev => {
        if (Math.random() > 0.99) {
          return prev + 1;
        }
        return prev;
      });
      
      // CPU usage - smooth oscillation
      setCpuUsage(prev => {
        const time = Date.now() / 1000;
        const base = 45;
        const wave = Math.sin(time * 0.05) * 15;
        const noise = (Math.random() - 0.5) * 5;
        return Math.max(20, Math.min(80, Math.round(base + wave + noise)));
      });
      
      // Memory usage - gradual changes
      setMemoryUsage(prev => {
        const delta = (Math.random() - 0.5) * 0.5;
        const newValue = prev + delta;
        return Math.max(40, Math.min(90, Math.round(newValue * 10) / 10));
      });
      
      // Update historical data
      setHistoricalVisitors(prev => [...prev.slice(1), visitors]);
      setHistoricalResponse(prev => [...prev.slice(1), responseTime]);
      setHistoricalAPI(prev => [...prev.slice(1), apiCalls]);
    }, 500); // Update every 500ms for smooth animations

    return () => clearInterval(interval);
  }, [visitors, responseTime, apiCalls]);

  // Generate smooth sparkline data from historical values
  const generateSparklineData = (data, points = 30) => {
    if (data.length < points) return data;
    const step = Math.floor(data.length / points);
    return data.filter((_, i) => i % step === 0).slice(-points);
  };

  const trafficData = generateSparklineData(historicalVisitors);
  const responseData = generateSparklineData(historicalResponse);
  const throughputData = generateSparklineData(historicalAPI);

  return (
    <div className="h-full relative overflow-hidden bg-black">
      {/* Background iframe - 1080p size centered */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
        <iframe
          src={caseStudy.links?.demo || caseStudy.links?.github || '#'}
          className="bg-white"
          style={{ width: '1920px', height: '1080px' }}
          title={caseStudy.hero.title}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
      
      {/* Subtle overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/05 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Left Sidebar - Monitoring Widgets */}
      <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-md border-r border-cyan-500/20 p-4 space-y-4 overflow-y-auto z-30 dashboard-scroll">
        
        {/* Properties Pane */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="mb-4">
            <h2 className="text-lg font-thin mb-1">Live Production Environment</h2>
            <p className="text-xs text-gray-400">This is the actual deployed solution running in production - proof that my work scales</p>
          </div>
          <h3 className="text-xs font-mono text-cyan-400 uppercase mb-3">System Properties</h3>
          
          <div className="space-y-3">
            {/* System Health */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Health Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                  />
                </div>
                <span className="text-xs font-bold text-white">98%</span>
              </div>
            </div>
            
            {/* Uptime */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Uptime</span>
              <span className="text-xs font-bold text-white">{uptime}%</span>
            </div>
            
            {/* Active Sessions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Sessions</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white">342</span>
                <TrendingUp className="w-3 h-3 text-green-400" />
              </div>
            </div>
            
            {/* Deployment */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Version</span>
              <span className="text-xs font-mono text-orange-400">v2.4.1</span>
            </div>
            
            {/* Environment */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Environment</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-400">Production</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
            
            {/* Coverage */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Coverage</span>
              <span className="text-xs font-bold text-blue-400">94.2%</span>
            </div>
            
            {/* Test Results */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Tests</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-400">✓ 342</span>
                <span className="text-xs text-red-400">✗ 0</span>
                <span className="text-xs text-yellow-400">⚠ 3</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Live Traffic Monitor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Users className="w-4 h-4 text-cyan-400" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-cyan-400/40 rounded-full blur-md"
                />
              </div>
              <span className="text-xs font-mono text-cyan-400 uppercase">Live Traffic</span>
            </div>
            <span className="text-lg font-bold text-white tabular-nums">
              {visitors.toLocaleString()}
            </span>
          </div>
          <div className="h-12 relative">
            <svg className="w-full h-full">
              <polyline
                points={trafficData.map((v, i) => `${i * 8},${48 - (v - 1100) * 0.1}`).join(' ')}
                fill="none"
                stroke="url(#trafficGradient)"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="trafficGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Active Users</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+12%</span>
            </div>
          </div>
        </motion.div>

        {/* Response Time Graph */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs font-mono text-green-400 uppercase">Response Time</span>
            </div>
            <span className={`text-lg font-bold tabular-nums ${
              responseTime < 300 ? 'text-green-400' : responseTime < 400 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {responseTime}ms
            </span>
          </div>
          <div className="h-16 flex items-end gap-1">
            {responseData.slice(-15).map((value, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all duration-500 ${
                  value < 300 ? 'bg-green-500' : value < 400 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ height: `${Math.min(100, (value - 100) / 4)}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* API Calls Monitor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono text-purple-400 uppercase">API Calls</span>
            </div>
            <span className="text-lg font-bold text-white tabular-nums">
              {apiCalls.toLocaleString()}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">/api/users</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    animate={{ 
                      width: `${65 + Math.sin(Date.now() / 2000) * 20}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-purple-400">
                  {Math.round(342 + Math.sin(Date.now() / 2000) * 50)}/s
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">/api/data</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    animate={{ 
                      width: `${50 + Math.sin(Date.now() / 2500) * 15}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-purple-400">
                  {Math.round(256 + Math.sin(Date.now() / 2500) * 30)}/s
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Success Rate</span>
              <span className="text-xs text-green-400">99.8%</span>
            </div>
          </div>
        </motion.div>

        {/* Error Rate Tracker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-4 h-4 ${errorCount > 0 ? 'text-red-400' : 'text-green-400'}`} />
              <span className={`text-xs font-mono uppercase ${errorCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                Error Rate
              </span>
            </div>
            <span className={`text-lg font-bold tabular-nums ${errorCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {errorCount}
            </span>
          </div>
          {errorCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-red-400">500 Internal Error</span>
                <span className="text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-yellow-400">429 Rate Limited</span>
                <span className="text-gray-500">5 min ago</span>
              </div>
            </motion.div>
          )}
          <div className="mt-3 h-8 flex items-end gap-px">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className={`flex-1 ${i === 19 && errorCount > 0 ? 'bg-red-500' : 'bg-gray-700'} rounded-t`}
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Sidebar - Performance Widgets */}
      <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-md border-l border-cyan-500/20 p-4 space-y-4 overflow-y-auto z-30 dashboard-scroll">
        
        {/* Server Resources */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono text-orange-400 uppercase">Server Resources</span>
          </div>
          
          {/* CPU Usage */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">CPU Usage</span>
                <span className={`text-xs font-bold ${cpuUsage > 70 ? 'text-red-400' : 'text-green-400'}`}>
                  {cpuUsage}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${cpuUsage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${cpuUsage > 70 ? 'bg-red-500' : 'bg-green-500'}`}
                />
              </div>
            </div>
            
            {/* Memory Usage */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Memory</span>
                <span className={`text-xs font-bold ${memoryUsage > 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {memoryUsage}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                <motion.div
                  animate={{ width: `${memoryUsage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${memoryUsage > 80 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                />
              </div>
            </div>
            
            {/* Disk I/O */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Disk I/O</span>
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <span className="text-xs text-purple-400">Active</span>
                </div>
              </div>
              <div className="h-8 flex items-center gap-px">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                    className="flex-1 h-full bg-purple-500 rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Database Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase">Database</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Query Time</span>
              <span className="text-xs text-green-400">12ms avg</span>
            </div>
            <div className="h-12 flex items-end gap-px">
              {Array.from({ length: 15 }, (_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-blue-500 rounded-t"
                  animate={{ 
                    height: `${20 + Math.sin((Date.now() / 1000 + i) * 0.5) * 30 + Math.random() * 30}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
              <div>
                <span className="text-xs text-gray-500 block">Connections</span>
                <span className="text-sm font-bold text-white">127/200</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Cache Hit</span>
                <span className="text-sm font-bold text-green-400">94.2%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Network Throughput */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Network className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono text-purple-400 uppercase">Network</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Bandwidth In</span>
                <span className="text-xs text-cyan-400">842 MB/s</span>
              </div>
              <div className="h-8 relative overflow-hidden rounded">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                />
                <div className="h-full bg-gray-800" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Bandwidth Out</span>
                <span className="text-xs text-purple-400">1.2 GB/s</span>
              </div>
              <div className="h-8 relative overflow-hidden rounded">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
                />
                <div className="h-full bg-gray-800" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <span className="text-xs text-gray-500">Latency</span>
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-5 gap-px">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded ${
                        i < 2 ? 'bg-green-500' : i < 4 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ opacity: 0.2 + (i * 0.2) }}
                    />
                  ))}
                </div>
                <span className="text-xs text-yellow-400">42ms</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-400 uppercase">Security</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Threat Level</span>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-xs text-green-400">Low</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">SSL Certificate</span>
              <span className="text-xs text-green-400">Valid</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Firewall</span>
              <span className="text-xs text-green-400">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">DDoS Protection</span>
              <span className="text-xs text-green-400">Enabled</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Last Scan</span>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReleaseTab;