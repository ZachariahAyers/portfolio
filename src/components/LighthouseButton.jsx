import React from 'react';
import { Tooltip } from './Tooltip';

const LighthouseButton = () => {
  const handleLighthouseClick = () => {
    window.open('https://pagespeed.web.dev/analysis?url=https://www.zachayers.io&form_factor=desktop&category=performance&category=accessibility&category=best-practices&category=seo', '_blank', 'noopener,noreferrer');
  };

  return (
    <Tooltip content="Run Lighthouse report on my Portfolio!">
      <button
        onClick={handleLighthouseClick}
        className="p-1 rounded-lg bg-[#0535c1] hover:bg-[#0535c1]/80 transition-all duration-200 group"
        aria-label="Run Lighthouse report on my Portfolio"
      >
        <img 
          src="/google-lighthouse-seeklogo.svg" 
          alt="Lighthouse" 
          className="w-7 h-7 group-hover:scale-110 transition-transform duration-200"
        />
      </button>
    </Tooltip>
  );
};

export default LighthouseButton;