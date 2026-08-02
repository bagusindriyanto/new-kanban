import { useTheme } from 'next-themes';
import AuroraDreamBackground from './AuroraDream';
import CosmicDustBackground from './CosmicDust';

const AnimatedBackground = ({ children }: { children?: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  // resolvedTheme otomatis resolve "system" → "light"/"dark"
  // Fallback ke system preference saat hydration (resolvedTheme masih undefined)
  const effective =
    resolvedTheme ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');

  if (effective === 'dark') {
    return <CosmicDustBackground>{children}</CosmicDustBackground>;
  }

  return <AuroraDreamBackground>{children}</AuroraDreamBackground>;
};

export default AnimatedBackground;
