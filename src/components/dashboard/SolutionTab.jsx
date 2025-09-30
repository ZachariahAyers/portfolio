import React, { useEffect, useState, useRef } from 'react';
import { FileCode2 } from 'lucide-react';
import mermaid from 'mermaid';
import { motion } from 'framer-motion';
import './SolutionTab.css';

const SolutionTab = ({ caseStudyId }) => {
  const [diagramContent, setDiagramContent] = useState('');
  const [loading, setLoading] = useState(true);
  const diagramRef = useRef(null);

  // Initialize mermaid with default theme
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default'
    });
  }, []);

  // Load diagram file
  useEffect(() => {
    const loadDiagram = async () => {
      try {
        const response = await fetch(`/diagrams/${caseStudyId}.solution.mermaid`);
        if (!response.ok) throw new Error('Diagram not found');
        const content = await response.text();
        setDiagramContent(content);
      } catch (error) {
        console.error('Failed to load diagram:', error);
        setDiagramContent('graph TB\n  Error["Failed to load diagram"]');
      } finally {
        setLoading(false);
      }
    };

    loadDiagram();
  }, [caseStudyId]);

  // Render mermaid diagram
  useEffect(() => {
    const renderDiagram = async () => {
      if (!diagramContent || !diagramRef.current) return;

      try {
        // Clear previous content
        diagramRef.current.innerHTML = '';
        
        // Generate unique ID
        const id = `mermaid-${Date.now()}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(id, diagramContent);
        diagramRef.current.innerHTML = svg;

        // Style the SVG
        const svgElement = diagramRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = '100%';
          svgElement.style.height = 'auto';
        }
      } catch (error) {
        console.error('Mermaid render error:', error);
        diagramRef.current.innerHTML = '<p class="text-red-400">Error rendering diagram</p>';
      }
    };

    renderDiagram();
  }, [diagramContent]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-200 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-8 h-8"
        >
          <FileCode2 className="w-full h-full text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-8 overflow-auto flex flex-col bg-gray-200 dark:bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-thin mb-2">Technical Architecture</h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 px-4 md:px-0">This is how I architect solutions - the same technical thinking I'd bring to your team</p>
      </motion.div>

      {/* Diagram Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex justify-center items-center"
      >
        <div className="bg-[#fffae6] rounded-lg p-4 md:p-8 border border-gray-400 dark:border-gray-600 w-full max-w-7xl overflow-auto mermaid-scroll-container touch-pan-x touch-pan-y" style={{ height: '60vh' }}>
          <div ref={diagramRef} className="mermaid-container" />
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8 text-xs text-gray-600 dark:text-gray-500"
      >
        <p>Technical Specification • Rendered with Mermaid</p>
      </motion.div>
    </div>
  );
};

export default SolutionTab;
