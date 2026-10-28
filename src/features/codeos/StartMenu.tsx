import { Zap } from 'lucide-react';
import { DropdownMenu } from 'radix-ui';
import { Fragment, useState } from 'react';
import { cx } from '../../lib/cx.ts';
import { APPS, type DesktopApp } from './apps.ts';

interface StartMenuProps {
  onLaunch: (app: DesktopApp) => void;
  onShutDown: () => void;
  align?: 'start' | 'center';
}

const item =
  'win98-menu-item flex w-full cursor-default items-center gap-3 px-3 py-2 text-left text-sm outline-hidden';

/** The Start button and its menu of apps. */
export function StartMenu({ onLaunch, onShutDown, align = 'start' }: StartMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger
        className={cx(
          'win98-face flex items-center gap-2 px-3 py-1 font-win98 text-sm font-bold',
          open ? 'win98-pressed' : 'win98-button',
        )}
      >
        <span
          className="h-4 w-4 rounded-xs bg-linear-to-br from-red-500 via-yellow-500 to-blue-500"
          aria-hidden
        />
        Start
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          align={align}
          sideOffset={2}
          className="win98-face win98-raised z-[1100] w-[250px] font-win98"
        >
          <div className="win98-banner flex h-[60px] items-center pl-1 text-lg font-bold text-white">
            CodeOS<span className="font-normal">&nbsp;98</span>
          </div>
          <div className="bg-white dark:bg-gray-800">
            {APPS.map((app, index) => (
              <Fragment key={app.id}>
                <DropdownMenu.Item className={item} onSelect={() => onLaunch(app)}>
                  <app.icon className="h-4 w-4" aria-hidden />
                  {app.name}
                </DropdownMenu.Item>
                {index === 0 && <DropdownMenu.Separator className="win98-separator mx-2 h-px" />}
              </Fragment>
            ))}
            <DropdownMenu.Separator className="win98-separator mx-2 h-px" />
            <DropdownMenu.Item className={item} onSelect={onShutDown}>
              <Zap className="h-4 w-4" aria-hidden />
              Return to home
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
