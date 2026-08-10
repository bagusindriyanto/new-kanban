import {
  motion,
  useMotionValue,
  // useSpring
} from 'motion/react';
import { useCallback } from 'react';

const AuroraDream = ({ children }: { children?: React.ReactNode }) => {
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
      style={{ filter: 'saturate(1)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: '#ffffff',
          width: '80%',
          height: '80%',
          top: '40%',
          left: '30%',
          opacity: 1,
          filter: 'blur(100px)',
          mixBlendMode: 'overlay',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: '#cbd5e1',
          width: '70%',
          height: '70%',
          top: '60%',
          left: '70%',
          opacity: 0.8,
          filter: 'blur(80px)',
          mixBlendMode: 'multiply',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 13.333333333333334,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ opacity: 0.05 }}
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

export default AuroraDream;
