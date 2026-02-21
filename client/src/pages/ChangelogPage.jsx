import { Timeline } from '@/components/Timeline';
import { useTheme } from 'next-themes';

const ChangelogPage = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen w-full relative">
      {theme === 'light' ? (
        <div
          className="fixed inset-0 -z-1"
          style={{
            backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
            backgroundSize: '32px 32px',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
            maskImage:
              'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
          }}
        />
      ) : (
        <div
          className="inset-0 fixed -z-1"
          style={{
            background:
              'radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)',
          }}
        />
      )}
      <Timeline />
    </div>
  );
};

export default ChangelogPage;
