import { useTheme } from 'next-themes';
import AuroraDreamBackground from './AuroraDream';
import CosmicDustBackground from './CosmicDust';

const AnimatedBackground = ({ children }) => {
  const { theme } = useTheme();
  if (theme === 'light') {
    return <AuroraDreamBackground>{children}</AuroraDreamBackground>;
  } else if (theme === 'dark') {
    return <CosmicDustBackground>{children}</CosmicDustBackground>;
  }
};

export default AnimatedBackground;
