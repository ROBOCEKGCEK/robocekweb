"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function RoboCore3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState({
    rotX: 0,
    rotY: 0,
    fps: 60,
    coreTemp: 34.2,
    mode: "SURVEILLANCE",
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const isExpandedRef = useRef(false);
  const wireframeRef = useRef(false);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  useEffect(() => {
    wireframeRef.current = wireframeMode;
  }, [wireframeMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all robotics objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Materials
    const cyanColor = new THREE.Color("#00f0ff");
    const violetColor = new THREE.Color("#a855f7");
    const emeraldColor = new THREE.Color("#10b981");

    // 1. Central Core Sphere (Glowing Inner Core)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: cyanColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Inner pulsating energy crystal
    const innerGeo = new THREE.OctahedronGeometry(0.5, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: violetColor,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Gimbal Rings
    // Ring 1 (Inner Gimbal)
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.022, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    mainGroup.add(ring1);

    // Ring 2 (Middle Gimbal)
    const ring2Geo = new THREE.TorusGeometry(1.85, 0.024, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: violetColor,
      transparent: true,
      opacity: 0.7,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    mainGroup.add(ring2);

    // Ring 3 (Outer Gimbal with Segmented Accents)
    const ring3Geo = new THREE.TorusGeometry(2.3, 0.028, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.6,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    mainGroup.add(ring3);

    // Ring 4 (Equatorial Telemetry Ring)
    const ring4Geo = new THREE.RingGeometry(2.55, 2.6, 64);
    const ring4Mat = new THREE.MeshBasicMaterial({
      color: emeraldColor,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const ring4 = new THREE.Mesh(ring4Geo, ring4Mat);
    ring4.rotation.x = Math.PI / 2;
    mainGroup.add(ring4);

    // Mechanical Node Points on Outer Ring
    const nodeGroup = new THREE.Group();
    const nodeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const nodeMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * 2.3, Math.sin(angle) * 2.3, 0);
      nodeGroup.add(node);
    }
    ring3.add(nodeGroup);

    // 3. Particle Starfield / Constellation
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: cyanColor,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        mainGroup.rotation.y += deltaX * 0.01;
        mainGroup.rotation.x += deltaY * 0.01;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        targetX = x * 0.45;
        targetY = y * 0.45;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch interaction
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        targetX = (((touch.clientX - rect.left) / rect.width) * 2 - 1) * 0.4;
        targetY = (-(((touch.clientY - rect.top) / rect.height) * 2 - 1)) * 0.4;
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    const startTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      const time = (now - startTime) / 1000;
      lastTime = now;

      // Smooth camera/group tilt towards target
      if (!isDragging) {
        mainGroup.rotation.y += (targetX - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetY - mainGroup.rotation.x) * 0.05;
      }

      // Continuous autonomous robotic gimbal rotations
      ring1.rotation.x += delta * 0.7;
      ring1.rotation.y += delta * 0.5;

      ring2.rotation.y -= delta * 0.55;
      ring2.rotation.z += delta * 0.4;

      ring3.rotation.z += delta * 0.35;
      ring3.rotation.x -= delta * 0.25;

      ring4.rotation.z -= delta * 0.2;

      // Pulse inner core
      const pulse = 1 + Math.sin(time * 3.5) * 0.12;
      innerMesh.scale.set(pulse, pulse, pulse);
      innerMesh.rotation.x += delta * 1.2;
      innerMesh.rotation.y += delta * 1.5;

      coreMesh.rotation.y -= delta * 0.3;
      coreMesh.rotation.x += delta * 0.2;

      // Handle Expand / Explode View
      const targetScale = isExpandedRef.current ? 1.45 : 1.0;
      ring3.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      ring2.scale.lerp(
        new THREE.Vector3(
          isExpandedRef.current ? 1.25 : 1.0,
          isExpandedRef.current ? 1.25 : 1.0,
          isExpandedRef.current ? 1.25 : 1.0
        ),
        0.05
      );

      // Handle Wireframe switch
      coreMat.wireframe = true;
      innerMat.wireframe = wireframeRef.current;

      // Drift particle constellation slowly
      particlePoints.rotation.y = time * 0.04;
      particlePoints.rotation.x = Math.sin(time * 0.05) * 0.1;

      // Telemetry update (~every 10 frames)
      frameCount++;
      if (performance.now() - lastFpsUpdate > 300) {
        const curFps = Math.round(1 / Math.max(delta, 0.001));
        const rotXDeg = Math.round((mainGroup.rotation.x * 180) / Math.PI);
        const rotYDeg = Math.round((mainGroup.rotation.y * 180) / Math.PI);
        setTelemetry({
          rotX: rotXDeg,
          rotY: rotYDeg,
          fps: Math.min(curFps, 60),
          coreTemp: +(34.2 + Math.sin(time) * 1.4).toFixed(1),
          mode: isExpandedRef.current ? "DIAGNOSTIC_EXPAND" : "SURVEILLANCE",
        });
        lastFpsUpdate = performance.now();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchmove", handleTouchMove);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto select-none group">
      {/* HUD Decorative Outer Corner Brackets */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-10 transition-all duration-300 group-hover:scale-110" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-10 transition-all duration-300 group-hover:scale-110" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-purple-500 pointer-events-none z-10 transition-all duration-300 group-hover:scale-110" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-purple-500 pointer-events-none z-10 transition-all duration-300 group-hover:scale-110" />

      {/* Cyber Reticle Overlay */}
      <div className="absolute inset-8 rounded-full border border-cyan-500/20 pointer-events-none animate-pulse" />
      <div className="absolute inset-16 rounded-full border border-dashed border-purple-500/25 pointer-events-none" />

      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-cyan-400/90 pointer-events-none z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-cyan-500/30">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-semibold">SYS.CORE // ROBOCEK-3D</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-400">
          <span>FPS: {telemetry.fps}</span>
          <span className="text-cyan-300">{telemetry.coreTemp}°C</span>
          <span className="text-purple-400">{telemetry.mode}</span>
        </div>
      </div>

      {/* Interactive Controls Bar at Bottom */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-[10px] font-mono z-20">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-zinc-800 text-zinc-400">
          <span className="text-cyan-400">PITCH:</span> {telemetry.rotX}°
          <span className="text-purple-400 ml-1">YAW:</span> {telemetry.rotY}°
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all duration-200 border ${
              isExpanded
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : "bg-black/60 text-zinc-300 border-zinc-800 hover:border-cyan-500/50 hover:text-cyan-300"
            }`}
          >
            {isExpanded ? "COMPACT" : "EXPAND 3D"}
          </button>
          <button
            type="button"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all duration-200 border ${
              wireframeMode
                ? "bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : "bg-black/60 text-zinc-300 border-zinc-800 hover:border-purple-500/50 hover:text-purple-300"
            }`}
          >
            WIRE
          </button>
        </div>
      </div>

      {/* Crosshair Center Reticle Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-cyan-400" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-cyan-400" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[1px] w-2 bg-cyan-400" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[1px] w-2 bg-cyan-400" />
      </div>

      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden bg-radial from-cyan-950/20 via-zinc-950/40 to-transparent"
        title="Click and drag to rotate the ROBOCEK 3D Gimbal Core"
      />
    </div>
  );
}
