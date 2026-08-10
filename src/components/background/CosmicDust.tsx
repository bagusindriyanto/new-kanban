import {
  motion,
  useMotionValue,
  // useSpring
} from 'motion/react';
import { useCallback } from 'react';

const CosmicDust = ({ children }: { children?: React.ReactNode }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  // const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY],
  );

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ filter: 'saturate(1.1)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0c0a09 0%, #1c1917 100%)',
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: 'rgba(192, 132, 252, 0.2)',
          width: '50%',
          height: '50%',
          top: '20%',
          left: '20%',
          opacity: 1,
          filter: 'blur(40px)',
          mixBlendMode: 'screen',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: 'rgba(244, 114, 182, 0.15)',
          width: '40%',
          height: '40%',
          top: '30%',
          left: '80%',
          opacity: 1,
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          width: '30%',
          height: '30%',
          top: '70%',
          left: '60%',
          opacity: 1,
          filter: 'blur(20px)',
          mixBlendMode: 'screen',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{
          duration: 6.666666666666667,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(139, 92, 246, 0.1), transparent)',
          width: '120%',
          height: '120%',
          top: '50%',
          left: '50%',
          opacity: 1,
          filter: 'blur(100px)',
          mixBlendMode: 'overlay',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 80, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ opacity: 0.3 }}
      >
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
      <div className="relative z-30">{children}</div>
    </div>
  );
};

export default CosmicDust;
