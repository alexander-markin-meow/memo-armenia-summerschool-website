'use client';

import { useEffect } from 'react';

export function GrainLayer() {
  useEffect(() => {
    const grainSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>" +
      "<filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.65' " +
      "numOctaves='4' stitchTiles='stitch'/></filter>" +
      "<rect width='512' height='512' filter='url(#n)'/></svg>";
    document.documentElement.style.setProperty('--grain-url', `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`);
  }, []);

  return <div className="background-grain" aria-hidden="true" />;
}
