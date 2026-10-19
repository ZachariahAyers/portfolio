import { useState, useEffect, useRef } from 'react';

const StreamingTextSimple = ({ 
  text = '', 
  speed = 8, 
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start streaming if we have text
    if (!text) return;

    let charIdx = 0;

    intervalRef.current = setInterval(() => {
      if (charIdx < text.length) {
        setDisplayedText(text.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed]);

  return (
    <p className={`text-gray-800 dark:text-gray-300 leading-relaxed ${className}`}>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1" />
      )}
    </p>
  );
};

export default StreamingTextSimple;