import React, { useEffect, useRef } from 'react';

interface WealthFluidProps {
  score: number; // 0 to 1
}

const WealthFluid: React.FC<WealthFluidProps> = ({ score }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      time += 0.005;
      
      // Clear with dark base
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create "Liquid" Gradient Mesh simulation
      // Adapting colors based on Wealth Score (Blue/Slate -> Gold/Emerald)
      const r1 = 16 + (score * 20); // Dark slate to slightly warm
      const g1 = 185 * score; // Emerald green influence
      const b1 = 128 + (score * 50);
      
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, `rgba(${r1}, ${g1 * 0.5}, ${b1}, 0.2)`);
      grad.addColorStop(0.5, `rgba(15, 23, 42, 0.0)`);
      grad.addColorStop(1, `rgba(${r1}, ${g1}, ${b1}, 0.1)`);

      ctx.fillStyle = grad;
      ctx.fillRect(0,0, canvas.width, canvas.height);

      // Draw flowing blobs
      for(let i = 0; i < 3; i++) {
        const x = canvas.width * 0.5 + Math.sin(time + i) * 300;
        const y = canvas.height * 0.5 + Math.cos(time * 0.8 + i) * 200;
        const radius = 200 + Math.sin(time * 0.5) * 50;

        const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        // Color shift based on wealth
        const blobColor = score > 0.7 
          ? `rgba(234, 179, 8, ${0.15 - (i*0.03)})` // Gold
          : `rgba(56, 189, 248, ${0.15 - (i*0.03)})`; // Sky Blue

        radialGrad.addColorStop(0, blobColor);
        radialGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [score]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default WealthFluid;