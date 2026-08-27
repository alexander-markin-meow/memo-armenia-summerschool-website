'use client';

import { useEffect } from 'react';

export function GrainLayer() {
  useEffect(() => {
    const grainSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'>" +
      "<filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.42' " +
      "numOctaves='5' stitchTiles='stitch'/></filter>" +
      "<rect width='1024' height='1024' filter='url(#n)'/></svg>";
    document.documentElement.style.setProperty('--grain-url', `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`);
  }, []);

  return <div className="background-grain" aria-hidden="true" />;
}
