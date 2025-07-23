import React, { useEffect, useRef } from 'react';
import SpaceInvaders from './experiments/SpaceInvaders';

const ExperimentCanvas = ({ experiment, isActive }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    // Clean up function for when experiment changes
    return () => {
      // Cleanup logic will be handled by individual experiments
    };
  }, [experiment, isActive]);

  if (!isActive) return null;

  const experiments = {
    invaders: SpaceInvaders
  };

  const ExperimentComponent = experiments[experiment];

  if (!ExperimentComponent) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ isolation: 'isolate' }}
    >
      <ExperimentComponent />
    </div>
  );
};

export default ExperimentCanvas;