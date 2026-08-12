import React, { useEffect, useRef, useState } from "react";

interface L3PreloaderProps {
  isLoading: boolean;
  onFinish?: () => void;
}

export const L3Preloader: React.FC<L3PreloaderProps> = ({ isLoading, onFinish }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const paths = containerRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      try {
        const len = path.getTotalLength();
        path.style.setProperty("--len", `${len}`);
      } catch (e) {
        path.style.setProperty("--len", "2000");
      }
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setExiting(true);
      const timer = setTimeout(() => {
        setHidden(true);
        if (onFinish) onFinish();
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onFinish]);

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      aria-label="Loading"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#0d0d0d] select-none transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        exiting
          ? "opacity-0 pointer-events-none backdrop-blur-sm"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Subtle Radial Neon Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,28,36,0.14)_0%,transparent_70%)] pointer-events-none" />

      {/* SVG Logo - Zoom In / Scale Up Expansion on Exit */}
      <div
        className={`relative z-10 w-[min(55vw,320px)] transition-all duration-850 ease-[cubic-bezier(0.7,0,0.2,1)] transform origin-center ${
          exiting
            ? "scale-[3.2] opacity-0 blur-[2px]"
            : "scale-100 opacity-100 blur-0"
        }`}
      >
        <svg
          className="w-full h-auto overflow-visible filter drop-shadow-[0_0_24px_rgba(237,28,36,0.8)]"
          viewBox="-100 -20 1050 680"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="logo-l3" transform="translate(150,20) skewX(-20)">
            <g id="letter-L" className="l3-letter-l">
              <path
                className="l3-path"
                d="M0,0 L110,0 L110,470 L350,470 L350,580 L0,580 Z"
              />
            </g>
            <g
              id="letter-3"
              className="l3-letter-3"
              transform="translate(380,0)"
            >
              <path
                className="l3-path"
                d="M350,0 L0,0 L0,110 L240,110 L240,235 L50,235 L50,345 L240,345 L240,470 L0,470 L0,580 L350,580 Z"
              />
            </g>
          </g>
        </svg>
      </div>

    </div>
  );
};
