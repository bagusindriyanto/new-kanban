import { useTheme } from 'next-themes';
import AuroraDream from './AuroraDream';
import CosmicDust from './CosmicDust';

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
    return <CosmicDust>{children}</CosmicDust>;
  }

  return <AuroraDream>{children}</AuroraDream>;
};

export default AnimatedBackground;
