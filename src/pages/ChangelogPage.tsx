import { Timeline } from '@/features/changelog/components/Timeline';
import Footer from '@/layouts/Footer';

const ChangelogPage = () => {
  return (
    <div className="min-h-screen flex flex-col" id="top">
      <Timeline />
      <Footer />
    </div>
  );
};

export default ChangelogPage;
