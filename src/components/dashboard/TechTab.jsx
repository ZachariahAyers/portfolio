import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Package, Wrench, Cpu, Database, Cloud, GitBranch, Terminal } from 'lucide-react';

const TechTab = ({ section, onCodeClick }) => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const sphereRef = useRef(null);
  
  if (!section) return null;

  // Technology categories with icons
  const categoryConfig = {
    core: { icon: Cpu, color: 'from-blue-500 to-cyan-600' },
    frameworks: { icon: Package, color: 'from-purple-500 to-pink-600' },
    tools: { icon: Wrench, color: 'from-orange-500 to-red-600' }
  };

  // All technologies flattened for 3D sphere
  const allTechs = Object.entries(section.categories || {}).flatMap(([category, techs]) =>
    techs.map(tech => ({ name: tech, category }))
  );

  // Calculate position in 3D sphere
  const getSpherePosition = (index, total) => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    
    const x = Math.cos(theta) * Math.sin(phi) * 150;
    const y = Math.sin(theta) * Math.sin(phi) * 150;
    const z = Math.cos(phi) * 150;
    
    return { x, y, z };
  };

  // Handle mouse movement for 3D rotation
  const handleMouseMove = (e) => {
    if (!sphereRef.current) return;
    
    const rect = sphereRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    setRotationY(x * 30);
    setRotationX(-y * 30);
  };

  const handleTechClick = (tech) => {
    setSelectedTech(tech);
    // Simulate code example
    if (onCodeClick) {
      onCodeClick({
        title: `${tech.name} Implementation`,
        code: `// Example ${tech.name} code
import { ${tech.name} } from '${tech.name.toLowerCase()}';

// Configuration and setup
const config = {
  // Your ${tech.name} configuration
};

// Implementation example
export default function example() {
  // ${tech.name} specific implementation
  return ...;
}`
      });
    }
  };

  return (
    <div className="h-full p-8 flex">
      {/* Left Panel - 3D Tech Sphere */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          ref={sphereRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-[600px] h-[600px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setRotationX(0);
            setRotationY(0);
          }}
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Core sphere */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-xl" />
          </motion.div>

          {/* Technology nodes */}
          {allTechs.map((tech, index) => {
            const pos = getSpherePosition(index, allTechs.length);
            const scale = (pos.z + 150) / 300; // Depth scaling
            const opacity = (pos.z + 150) / 300; // Depth fading
            const Icon = categoryConfig[tech.category]?.icon || Code2;
            
            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) scale(${scale})`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-40px',
                  marginTop: '-40px',
                  opacity
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTechClick(tech)}
                  className={`
                    w-20 h-20 rounded-lg backdrop-blur-sm
                    border transition-all duration-300 group
                    ${selectedTech?.name === tech.name
                      ? 'bg-cyan-500/30 border-cyan-400 shadow-lg shadow-cyan-400/50' 
                      : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/50'
                    }
                  `}
                >
                  <Icon className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
                  <span className="text-xs text-gray-300 block truncate px-1">
                    {tech.name}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}

          {/* Orbit rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/10"
              style={{
                width: `${ring * 200}px`,
                height: `${ring * 200}px`,
              }}
              animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 * ring, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </motion.div>
      </div>

      {/* Right Panel - Categories & Details */}
      <div className="w-96 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-thin mb-2">{section.title}</h2>
          <p className="text-gray-400 text-sm">Hover the 3D sphere to explore the technologies I work with daily</p>
        </motion.div>

        {/* Category Breakdown */}
        {Object.entries(section.categories || {}).map(([category, techs], idx) => {
          const Icon = categoryConfig[category]?.icon || Code2;
          const gradient = categoryConfig[category]?.color || 'from-gray-500 to-gray-600';
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg capitalize font-light">{category}</h3>
                <span className="ml-auto text-sm text-gray-500">{techs.length} items</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <motion.button
                    key={tech}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTechClick({ name: tech, category })}
                    className={`
                      px-3 py-1 rounded text-xs transition-all
                      ${selectedTech?.name === tech
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50' 
                        : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:border-gray-500'
                      }
                    `}
                  >
                    {tech}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
};

export default TechTab;