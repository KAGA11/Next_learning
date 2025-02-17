import { GlobeAltIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
// import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={clsx(
        'flex flex-row items-center leading-none text-white',
        // lusitana.className,
        )
      }
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Acme</p>
    </div>
  );
}
