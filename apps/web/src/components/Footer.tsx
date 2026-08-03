import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import {
  FavouriteIcon,
  GithubIcon,
  Globe02Icon,
  NewTwitterIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { FooterLink } from '@/components/FooterLink';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link className="flex items-center gap-2" href="/">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-md shadow-violet-600/20">
                <Image
                  alt="Octogriffin Logo"
                  className="h-5 w-5 object-contain"
                  height={20}
                  src="/octogriffin_white.png"
                  width={20}
                />
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-50">
                Octogriffin
              </span>
            </Link>
            <Content className="max-w-xs" size="sm">
              Level up your RPG character automatically while you code. Open
              source, secure, and built for developers.
            </Content>

            <Link
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-rose-500 hover:text-rose-500 hover:shadow-md active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-rose-500/50"
              href="/sponsors"
            >
              <HugeiconsIcon
                className="text-rose-500 fill-rose-500"
                icon={FavouriteIcon}
                size={18}
              />
              <span>Become a Sponsor</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <Heading className="font-semibold text-base" level={3}>
                Product
              </Heading>
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/installation">Install App</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/profile">Profile</FooterLink>
              <FooterLink href="/sponsors">Sponsors</FooterLink>
            </div>

            <div className="flex flex-col gap-3">
              <Heading className="font-semibold text-base" level={3}>
                Resources
              </Heading>
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/docs/how-to-contribute">
                Contributing
              </FooterLink>
              <FooterLink href="/roadmap">Roadmap</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href={githubRepositoryUrl()} target="_blank">
                GitHub Repo
              </FooterLink>
            </div>

            <div className="flex flex-col gap-3">
              <Heading className="font-semibold text-base" level={3}>
                Legal
              </Heading>
              <FooterLink href="/imprint">Imprint</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-and-conditions">
                Terms and Conditions
              </FooterLink>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row dark:border-slate-800">
          <Content size="sm">
            &copy; {currentYear} Octogriffin. Not affiliated with Habitica.
          </Content>

          <div>
            {!!version && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                v{version}
              </span>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-1.5 text-sm text-slate-500 md:flex dark:text-slate-400">
              <span>Made with</span>
              <HugeiconsIcon
                className="fill-red-500 text-red-500"
                icon={FavouriteIcon}
                size={16}
              />
              <span>by</span>
              <Link
                className="font-medium text-slate-900 transition-colors hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400"
                href="https://www.bebic.dev"
                rel="noreferrer"
                target="_blank"
              >
                Drazen Bebic
              </Link>
              <span>in Vienna</span>
            </div>

            <div className="flex gap-4">
              <Link
                aria-label="GitHub Profile"
                className="text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                href="https://github.com/drazenbebic"
                rel="noreferrer"
                target="_blank"
              >
                <HugeiconsIcon icon={GithubIcon} size={20} />
              </Link>
              <Link
                aria-label="X Profile"
                className="text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                href="https://twitter.com/drazenbebic"
                rel="noreferrer"
                target="_blank"
              >
                <HugeiconsIcon icon={NewTwitterIcon} size={20} />
              </Link>
              <Link
                aria-label="Personal Website"
                className="text-slate-400 transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                href="https://www.bebic.dev"
                rel="noreferrer"
                target="_blank"
              >
                <HugeiconsIcon icon={Globe02Icon} size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
