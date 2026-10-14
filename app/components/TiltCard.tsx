"use client";

import React, { useRef, useState } from "react";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "emerald" | "amber";
  tiltMaxAngle?: number;
  showCorners?: boolean;
};

export default function TiltCard({
  children,
  className = "",
  glowColor = "cyan",
  tiltMaxAngle = 12,
  showCorners = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const glowStyles = {
    cyan: "hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.18)]",
    purple: "hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)]",
    emerald: "hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]",
    amber: "hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)]",
  };

  const glareGradients = {
    cyan: "radial-gradient(circle 220px at %X% %Y%, rgba(6,182,212,0.18), transparent 70%)",
    purple: "radial-gradient(circle 220px at %X% %Y%, rgba(168,85,247,0.18), transparent 70%)",
    emerald: "radial-gradient(circle 220px at %X% %Y%, rgba(16,185,129,0.18), transparent 70%)",
    amber: "radial-gradient(circle 220px at %X% %Y%, rgba(245,158,11,0.18), transparent 70%)",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -tiltMaxAngle;
    const rotateY = ((x - centerX) / centerX) * tiltMaxAngle;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const currentGradient = glareGradients[glowColor]
    .replace("%X%", `${glarePosition.x}%`)
    .replace("%Y%", `${glarePosition.y}%`);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: "transform 0.15s ease-out, border-color 0.25s ease, box-shadow 0.25s ease",
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${glowStyles[glowColor]} ${className}`}
    >
      {/* Specular Holographic Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background: currentGradient,
          opacity: glarePosition.opacity,
        }}
      />

      {/* Cyber Corner Marks */}
      {showCorners && (
        <>
          <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-cyan-400/60 pointer-events-none z-10" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-cyan-400/60 pointer-events-none z-10" />
          <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-purple-400/60 pointer-events-none z-10" />
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-purple-400/60 pointer-events-none z-10" />
        </>
      )}

      {children}
    </div>
  );
}
