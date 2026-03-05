import { Timeline } from '@/components/dashboard/Timeline';
import { useTheme } from 'next-themes';
import SiteHeader from '@/components/layout/SiteHeader';

const ChangelogPage = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col relative" id="top">
      <SiteHeader titlePage="Changelog" />
      {theme === 'light' ? (
        <div
          className="fixed inset-0 -z-1"
          style={{
            background: '#ffffff',
            backgroundImage: `
        radial-gradient(
          circle at top center,
          rgba(70, 130, 180, 0.15),
          transparent 70%
        )
      `,
            filter: 'blur(80px)',
            backgroundRepeat: 'no-repeat',
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
