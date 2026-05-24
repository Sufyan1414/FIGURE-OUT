import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if the device matches touch capabilities (touchscreens don't use cursors)
    const checkIsMobile = () => {
      const match = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(match);
      
      if (!match) {
        document.documentElement.classList.add('custom-cursor-active');
      } else {
        document.documentElement.classList.remove('custom-cursor-active');
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setIsVisible(true);
    };

    const updateTrail = () => {
      // Linear interpolation for smooth spring lag easing
      const dx = mousePos.current.x - trailPos.current.x;
      const dy = mousePos.current.y - trailPos.current.y;
      
      trailPos.current.x += dx * 0.18; // Increased from 0.15 for tighter tracking
      trailPos.current.y += dy * 0.18;

      // Update positions directly with high-frequency 3D hardware-acceleration
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(updateTrail);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Filter focus states beautifully on interactive targets
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.interactive') ||
          target.classList.contains('interactive') ||
          target.getAttribute('role') === 'button'
        )
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    requestRef.current = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.classList.remove('custom-cursor-active');
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // Run exactly once on mount so listeners never thrash or teardown

  if (isMobile) return null;

  return (
    <>
      {/* Inner physical dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] rounded-full bg-emerald-500 transition-[width,height,opacity,background-color] duration-200 ease-out"
        style={{
          width: isClicking ? '4px' : isHovering ? '12px' : '8px',
          height: isClicking ? '4px' : isHovering ? '12px' : '8px',
          opacity: isVisible ? 0.95 : 0,
          mixBlendMode: isHovering ? 'difference' : 'normal',
          transform: 'translate3d(0, 0, 0) translate(-50%, -50%)',
          left: 0,
          top: 0,
          willChange: 'transform',
        }}
        id="custom-cursor-inner"
      />
      
      {/* Outer elastic ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9999] rounded-full border border-emerald-500/60 transition-[width,height,opacity,border-color] duration-300 ease-out"
        style={{
          width: isClicking ? '46px' : isHovering ? '52px' : '30px',
          height: isClicking ? '46px' : isHovering ? '52px' : '30px',
          borderColor: isHovering ? '#f59e0b' : '#10b981', // Elegant transition color
          opacity: isVisible ? 0.6 : 0,
          transform: 'translate3d(0, 0, 0) translate(-50%, -50%)',
          left: 0,
          top: 0,
          willChange: 'transform',
        }}
        id="custom-cursor-outer"
      />
    </>
  );
}
