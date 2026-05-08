import { Timeline } from '@/components/dashboard/Timeline';
import Footer from '@/components/layout/Footer';

const ChangelogPage = () => {
  return (
    <div className="min-h-screen flex flex-col" id="top">
      <Timeline />
      <Footer />
    </div>
  );
};

export default ChangelogPage;
