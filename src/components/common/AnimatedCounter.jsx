import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, duration = 1200, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // If value contains non-numeric chars like commas or decimals, parse it
    const cleanNum = typeof value === 'number' 
      ? value 
      : parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;

    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * cleanNum);
      
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(cleanNum);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = displayValue.toLocaleString();

  return (
    <span>{prefix}{formatted}{suffix}</span>
  );
}
