import React, { useEffect, useRef } from "react";

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Matrix Rain Data
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const rainDrops: number[] = Array(columns).fill(1).map(() => Math.random() * -100);
    const chars = "01ABCDEF賽博朋克9D00FF00F5FFSYSTEMLOCKACTIVEGOBACK";

    // Ambient Particles Data
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
    }> = Array(30)
      .fill(null)
      .map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? "rgba(0, 245, 255," : "rgba(157, 0, 255,",
        alpha: Math.random() * 0.5 + 0.2
      }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    let tick = 0;
    const draw = () => {
      tick++;

      // Fade canvas slowly to create trail effect
      ctx.fillStyle = "rgba(5, 8, 16, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Dot Grid (Cyberpunk HUD feel)
      ctx.fillStyle = "rgba(0, 245, 255, 0.035)";
      const dotSpacing = 30;
      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw slow moving neon particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          ctx.arc(p.x, p.y, p.radius + i * 0.5, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      // 3. Matrix Code Rain (Subtle background layer)
      if (tick % 2 === 0) {
        ctx.fillStyle = "rgba(0, 255, 65, 0.12)"; // Matrix Green text
        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < rainDrops.length; i++) {
          if (rainDrops[i] < 0) {
            rainDrops[i]++;
            continue;
          }

          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

          if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
            rainDrops[i] = 0;
          }
          rainDrops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle Horizontal Scanline */}
      <div className="scanline-effect" />
    </div>
  );
};
