"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface ZoomImageProps {
  src: string;
  alt?: string;
  /** Size of the zoom lens in px */
  lensSize?: number;
  /** Zoom scale e.g. 2 = 200% */
  zoomScale?: number;
  className?: string;
}

export default function ZoomImage({
  src,
  alt = "",
  lensSize = 220,
  zoomScale = 2,
  className = "",
}: ZoomImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const onMouseEnter = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setContainerSize({ w: rect.width, h: rect.height });
    setVisible(true);
  };

  const onMouseLeave = () => {
    setVisible(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // clamp inside image
    const x = Math.max(0, Math.min(offsetX, rect.width));
    const y = Math.max(0, Math.min(offsetY, rect.height));

    // percentage position for background
    const posX = (x / rect.width) * 100;
    const posY = (y / rect.height) * 100;

    // lens center position (so lens is centered on cursor)
    setLensPos({ x: offsetX - lensSize / 2, y: offsetY - lensSize / 2 });
    setBgPos({ x: posX, y: posY });
  };

  // Touch fallback: toggle visible on tap (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    const posX = (offsetX / rect.width) * 100;
    const posY = (offsetY / rect.height) * 100;
    setBgPos({ x: posX, y: posY });
    setLensPos({ x: offsetX - lensSize / 2, y: offsetY - lensSize / 2 });
    setContainerSize({ w: rect.width, h: rect.height });
    setVisible((v) => !v);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      // prevent carousel swipe interference when interacting with zoom:
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* base image */}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* lens / overlay (only for non-mobile, but it works with touch toggle too) */}
      {/* The lens is an absolutely positioned square that shows a zoomed BG image */}
      <div
        aria-hidden
        className="pointer-events-none"
        style={{
          display: visible ? "block" : "none",
          position: "absolute",
          // lens outer position (follows cursor)
          left: Math.max(0, Math.min(lensPos.x, containerSize.w - lensSize)),
          top: Math.max(0, Math.min(lensPos.y, containerSize.h - lensSize)),
          width: lensSize,
          height: lensSize,
          borderRadius: 8,
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
          border: "2px solid rgba(255,255,255,0.85)",
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          // background size is scaled by zoomScale
          backgroundSize: `${zoomScale * 100}% ${zoomScale * 100}%`,
          // background position set to cursor percentage
          backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
          zIndex: 50,
          transition: "opacity 120ms ease, transform 120ms ease",
          transform: visible ? "scale(1)" : "scale(0.98)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* optional larger fixed preview to the right (desktop-only) */}
      {/* Uncomment below block if you prefer a large fixed preview beside the image */}
      {/*
      <div
        style={{
          display: visible ? "block" : "none",
          position: "absolute",
          right: -18 - Math.min(200, lensSize), // adjust placement
          top: 0,
          width: Math.min(380, containerSize.w * 0.9),
          height: Math.min(380, containerSize.h * 0.9),
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          border: "1px solid rgba(0,0,0,0.06)",
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${zoomScale * 100}% ${zoomScale * 100}%`,
          backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
          zIndex: 40,
        }}
        className="hidden lg:block"
      />
      */}
    </div>
  );
}
