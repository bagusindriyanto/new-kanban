import { Timeline } from '@/components/dashboard/Timeline';
import SiteHeader from '@/components/layout/SiteHeader';

const ChangelogPage = () => {
  return (
    <div className="min-h-screen flex flex-col" id="top">
      <SiteHeader titlePage="Changelog" />
      <Timeline />
    </div>
  );
};

export default ChangelogPage;
