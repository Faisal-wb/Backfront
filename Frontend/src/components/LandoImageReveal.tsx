import React, { useState, useRef, useEffect } from "react";

interface LandoImageRevealProps {
  img1: string;
  imgLT3: string;
  alt1?: string;
  altLT3?: string;
}

interface LiquidParticle {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  lerpSpeed: number;
  offsetDistance: number;
  pulsePhase: number;
}

export const LandoImageReveal: React.FC<LandoImageRevealProps> = ({
  img1,
  imgLT3,
  alt1 = "Gambar 1 TJKT",
  altLT3 = "Gambar LT3 Media",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Position references
  const targetPos = useRef({ x: -500, y: -500 });
  const currentPos = useRef({ x: -500, y: -500 });
  const size = useRef({ width: 600, height: 600 });
  const maskRadius = useRef(0);

  // Path SVG State string for the multi-particle liquid metaballs
  const [pathData, setPathData] = useState("");

  // 16 Dynamic Water Droplet Particles around the cursor
  const NUM_PARTICLES = 16;
  const particles = useRef<LiquidParticle[]>([]);

  // Initialize Particles
  useEffect(() => {
    particles.current = Array.from({ length: NUM_PARTICLES }, (_, i) => {
      const isMain = i === 0;
      const baseR = isMain ? 105 : 20 + Math.random() * 40;
      return {
        x: -500,
        y: -500,
        radius: 0,
        baseRadius: baseR,
        lerpSpeed: isMain ? 0.14 : 0.04 + Math.random() * 0.08,
        offsetDistance: isMain ? 0 : 15 + Math.random() * 80,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  // Handle Resize
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      size.current = { width: rect.width, height: rect.height };
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Animation Loop for Liquid Particles Reveal
  useEffect(() => {
    let animId: number;

    const animate = (time: number) => {
      const targetRadius = isHovered ? 1 : 0;
      // Smoothly expand/collapse liquid mask size on hover enter/leave
      maskRadius.current += (targetRadius - maskRadius.current) * 0.14;

      // Smooth lerp main cursor position
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.12;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.12;

      // Generate SVG path for all liquid water particles
      let svgPaths = "";

      particles.current.forEach((p, idx) => {
        // Target position with organic orbital drift
        const orbitX = Math.cos(time * 0.002 + p.pulsePhase) * p.offsetDistance;
        const orbitY = Math.sin(time * 0.0025 + p.pulsePhase) * p.offsetDistance;
        const pTargetX = currentPos.current.x + orbitX;
        const pTargetY = currentPos.current.y + orbitY;

        // Smooth position lerp
        p.x += (pTargetX - p.x) * p.lerpSpeed;
        p.y += (pTargetY - p.y) * p.lerpSpeed;

        // Dynamic pulsing radius
        const pulse = Math.sin(time * 0.003 + p.pulsePhase) * 6;
        const currentR = Math.max(0, (p.baseRadius + pulse) * maskRadius.current);
        p.radius = currentR;

        if (currentR > 2) {
          // Generate 6 or 8-point organic blob for each droplet
          const points: { x: number; y: number }[] = [];
          const ptsCount = idx === 0 ? 8 : 6;

          for (let k = 0; k < ptsCount; k++) {
            const angle = (k / ptsCount) * Math.PI * 2;
            const wave = Math.sin(time * 0.004 + k + p.pulsePhase) * (currentR * 0.15);
            const r = currentR + wave;
            points.push({
              x: p.x + Math.cos(angle) * r,
              y: p.y + Math.sin(angle) * r,
            });
          }

          // Smooth Bezier path per particle
          let d = "";
          const len = points.length;
          for (let k = 0; k < len; k++) {
            const p0 = points[(k - 1 + len) % len];
            const p1 = points[k];
            const p2 = points[(k + 1) % len];
            const p3 = points[(k + 2) % len];

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            if (k === 0) d += `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} `;
            d += `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `;
          }
          d += "Z ";
          svgPaths += d;
        }
      });

      setPathData(svgPaths);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetPos.current = { x, y };
    currentPos.current = { x, y };
    particles.current.forEach((p) => {
      p.x = x;
      p.y = y;
    });
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    targetPos.current = { x, y };
    currentPos.current = { x, y };
    particles.current.forEach((p) => {
      p.x = x;
      p.y = y;
    });
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    targetPos.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => setIsHovered(false)}
      onTouchMove={handleTouchMove}
      className="relative w-full h-full min-h-[480px] lg:min-h-[560px] rounded-[2rem] overflow-hidden bg-zinc-950 select-none shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      {/* SVG ClipPath Definition (NO OUTLINE STROKES) */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="lando-liquid-clean-mask" clipPathUnits="userSpaceOnUse">
            <path d={pathData} />
          </clipPath>
        </defs>
      </svg>

      {/* LAYER 1: BASE IMAGE (Gambar 1) */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={img1}
          alt={alt1}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>

      {/* LAYER 2: REVEAL IMAGE INSIDE CLEAN SVG LIQUID CLIP-PATH */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          clipPath: "url(#lando-liquid-clean-mask)",
          WebkitClipPath: "url(#lando-liquid-clean-mask)",
          opacity: maskRadius.current > 0.01 ? 1 : 0,
        }}
      >
        <img
          src={imgLT3}
          alt={altLT3}
          className="w-full h-full object-cover object-center scale-[1.04] transition-transform duration-300"
        />
      </div>
    </div>
  );
};
