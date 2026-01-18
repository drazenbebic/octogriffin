import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { FavouriteIcon, GithubIcon, NewTwitterIcon } from 'hugeicons-react';

import { FooterLink } from '@/components/FooterLink';
import { Heading } from '@/components/ui/Heading';
import { githubAppUrl } from '@/utils/githubAppUrl';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-md shadow-violet-600/20">
                <Image
                  src="/octogriffin_white.png"
                  alt="Octogriffin Logo"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <span className="font-bold text-slate-900">Octogriffin</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Level up your RPG character automatically while you code. Open
              source, secure, and built for developers.
            </p>

            <Link
              href="/sponsors"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-rose-500 hover:text-rose-500 hover:shadow-md active:scale-95"
            >
              <FavouriteIcon
                size={18}
                className="text-rose-500 fill-rose-500"
              />
              <span>Become a Sponsor</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <Heading level={3} className="font-semibold text-base">
                Product
              </Heading>
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/profile">Profile</FooterLink>
              <FooterLink href="/sponsors">Sponsors</FooterLink>
              <FooterLink href={githubAppUrl()} target="_blank">
                Install App
              </FooterLink>
            </div>

            <div className="flex flex-col gap-3">
              <Heading level={3} className="font-semibold text-base">
                Resources
              </Heading>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href={githubRepositoryUrl()} target="_blank">
                GitHub Repo
              </FooterLink>
              <FooterLink href="https://habitica.com" target="_blank">
                Habitica
              </FooterLink>
              <FooterLink
                href="https://habitica.fandom.com/wiki/Habitica_Wiki"
                target="_blank"
              >
                Wiki
              </FooterLink>
            </div>

            <div className="flex flex-col gap-3">
              <Heading level={3} className="font-semibold text-base">
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} Octogriffin. Not affiliated with Habitica.
          </p>

          <div>
            {!!version && (
              <span className="hidden text-xs text-slate-500 sm:inline-block">
                v{version}
              </span>
            )}
            {!!version && (
              <p className="text-center text-xs text-slate-500 sm:hidden">
                v{version}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-1.5 text-sm text-slate-500 md:flex">
              <span>Made with</span>
              <FavouriteIcon size={16} className="fill-red-500 text-red-500" />
              <span>by</span>
              <Link
                href="https://www.bebic.dev"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-900 transition-colors hover:text-violet-600"
              >
                Drazen Bebic
              </Link>
              <span>in Vienna</span>
            </div>

            <div className="flex gap-4">
              <Link
                href="https://github.com/drazenbebic"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 transition-colors hover:text-slate-900"
              >
                <GithubIcon size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com/drazenbebic"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 transition-colors hover:text-slate-900"
              >
                <NewTwitterIcon size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
