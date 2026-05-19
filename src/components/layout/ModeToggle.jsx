import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            onClick={() =>
              theme === 'light' ? setTheme('dark') : setTheme('light')
            }
            variant="outline"
            size="icon"
          />
        }
      >
        <MoonIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all duration-400 dark:scale-0 dark:-rotate-90" />
        <SunIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all duration-400 dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Mode {theme === 'light' ? 'Gelap' : 'Terang'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ModeToggle;
