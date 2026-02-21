import { Link } from 'react-router';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="flex items-center justify-between h-[35px] bg-nav py-2">
      <div className="flex-1"></div>
      <p className="flex-1 text-white text-center text-xs font-normal">
        Made with &#10084; by Data Analyst &copy; {new Date().getFullYear()}
      </p>
      <div className="flex-1 flex justify-end items-center pr-4">
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Link
              className="border border-white/20 rounded-sm p-1 hover:opacity-70"
              to="/changelog"
            >
              <Info className="text-white size-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Changelog</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </footer>
  );
};

export default Footer;
