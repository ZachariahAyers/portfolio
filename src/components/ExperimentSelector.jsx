import React from 'react';
import { X, Gamepad2 } from 'lucide-react';

const ExperimentSelector = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const experiments = [
    {
      id: 'invaders',
      name: 'Space Invaders',
      description: 'Defend against alien invasion with explosive lasers',
      icon: Gamepad2,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const handleSelect = (experimentId) => {
    onSelect(experimentId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Selector Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[80vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Choose Your Experiment</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
          
          {/* Experiments Grid */}
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiments.map((experiment) => {
                const Icon = experiment.icon;
                return (
                  <button
                    key={experiment.id}
                    onClick={() => handleSelect(experiment.id)}
                    className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-6 text-left transition-all hover:scale-105 hover:border-gray-600"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${experiment.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    {/* Content */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${experiment.color}`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{experiment.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{experiment.description}</p>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-500">Click an experiment to begin • Press ESC to close</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperimentSelector;