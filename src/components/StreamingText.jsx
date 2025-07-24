import React, { useState, useEffect, useRef } from 'react';

const StreamingText = ({ 
  bulletPoints = [], 
  speed = 8, 
  onComplete,
  className = ""
}) => {
  const [displayedBullets, setDisplayedBullets] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    // Reset state
    setDisplayedBullets([]);
    setCurrentText('');
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start streaming if we have content
    if (bulletPoints.length === 0) return;

    // Handle bullet points streaming
    let bulletIdx = 0;
    let charIdx = 0;
    let bullets = [];

    intervalRef.current = setInterval(() => {
      if (bulletIdx >= bulletPoints.length) {
        clearInterval(intervalRef.current);
        if (onComplete) onComplete();
        return;
      }

      const currentBullet = bulletPoints[bulletIdx];
      if (!currentBullet) {
        bulletIdx++;
        return;
      }

      if (charIdx < currentBullet.length) {
        setCurrentText(currentBullet.slice(0, charIdx + 1));
        charIdx++;
      } else {
        // Bullet complete, add to displayed list
        bullets = [...bullets, currentBullet];
        setDisplayedBullets([...bullets]);
        
        // Move to next bullet
        bulletIdx++;
        charIdx = 0;
        
        // Only clear current text if we're done
        if (bulletIdx >= bulletPoints.length) {
          setCurrentText('');
          clearInterval(intervalRef.current);
          if (onComplete) onComplete();
        } else {
          // Start showing the next bullet immediately
          setCurrentText('');
        }
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bulletPoints, speed]);

  // Render bullet points
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Display completed bullets */}
      {displayedBullets.map((bullet, idx) => (
        <div key={`completed-${idx}`} className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">▸</span>
          <p className="text-gray-300 flex-1">{bullet}</p>
        </div>
      ))}
      
      {/* Display currently streaming bullet */}
      {currentText && (
        <div className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">▸</span>
          <p className="text-gray-300 flex-1">
            {currentText}
            <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1" />
          </p>
        </div>
      )}
    </div>
  );
};

export default StreamingText;