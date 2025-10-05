type TwinkleStar = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
};

import { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<TwinkleStar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const STAR_COLORS = [
      'rgba(255,255,255,0.85)',
      'rgba(168,85,247,0.7)',
      'rgba(59,130,246,0.7)',
    ];

    function spawnStar() {
      const size = Math.random() * 1.5 + 0.7;
      const maxLife = Math.random() * 60 + 40; // frames
      stars.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        opacity: 0,
        life: 0,
        maxLife,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      });
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Randomly spawn new stars
      if (Math.random() < 0.08 && stars.current.length < 40) {
        spawnStar();
      }

      // Animate and draw stars
      stars.current.forEach(star => {
        // Fade in/out
        if (star.life < star.maxLife / 3) {
          star.opacity = star.life / (star.maxLife / 3);
        } else if (star.life > (star.maxLife * 2) / 3) {
          star.opacity = 1 - (star.life - (star.maxLife * 2) / 3) / (star.maxLife / 3);
        } else {
          star.opacity = 1;
        }
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
        star.life++;
      });
      // Remove dead stars
      stars.current = stars.current.filter(star => star.life < star.maxLife);

      requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}