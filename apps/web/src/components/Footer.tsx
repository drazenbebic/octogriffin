import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import {
  FavouriteIcon,
  GithubIcon,
  Globe02Icon,
  NewTwitterIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';

import { FooterLink } from '@/components/FooterLink';
import { Shell } from '@/components/ui/Shell';
import { Tooltip } from '@/components/ui/Tooltip';
import { shortCommit } from '@/utils/buildInfo';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

const socials: { href: string; icon: IconSvgElement; label: string }[] = [
  { href: 'https://github.com/drazenbebic', icon: GithubIcon, label: 'GitHub' },
  { href: 'https://twitter.com/drazenbebic', icon: NewTwitterIcon, label: 'X' },
  { href: 'https://www.bebic.dev', icon: Globe02Icon, label: 'Website' },
];

const FooterHeading: FC<{ children: string }> = ({ children }) => (
  <h3 className="mb-1 text-[13px] font-semibold text-text">{children}</h3>
);

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA;
  const commit = shortCommit(commitSha);

  return (
    <footer className="border-t border-border bg-sunken">
      <Shell className="flex flex-col gap-10 pt-14 pb-7">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="col-span-2 flex flex-col gap-3.5 lg:col-span-5">
            <Link className="flex w-fit items-center gap-2.5" href="/">
              <Image
                alt=""
                className="h-7 w-7 rounded-[7px]"
                height={28}
                src="/octogriffin_logo_square.png"
                width={28}
              />
              <span className="font-display text-lg font-bold tracking-[-0.02em] text-text">
                Octogriffin
              </span>
            </Link>
            <p className="max-w-[36ch] text-sm text-text-2">
              Level up your Habitica character while you code. Free, open
              source, and built for developers.
            </p>
            <Link
              className="mt-1 inline-flex h-9 w-fit items-center gap-2 rounded-md border border-border-strong bg-surface px-3.5 text-[13px] font-semibold text-text shadow-e1 transition-colors duration-[var(--dur-fast)] hover:bg-sunken"
              href="/sponsors"
            >
              <HugeiconsIcon
                className="fill-hp text-hp"
                icon={FavouriteIcon}
                size={16}
              />
              Become a sponsor
            </Link>
          </div>

          <div className="flex flex-col gap-2.5 lg:col-span-2">
            <FooterHeading>Product</FooterHeading>
            <FooterLink href="/installation">Install app</FooterLink>
            <FooterLink href="/dashboard">Dashboard</FooterLink>
            <FooterLink href="/docs/coding-habits">Recipes</FooterLink>
            <FooterLink href="/roadmap">Roadmap</FooterLink>
            <FooterLink href="/sponsors">Sponsors</FooterLink>
          </div>

          <div className="flex flex-col gap-2.5 lg:col-span-3">
            <FooterHeading>Resources</FooterHeading>
            <FooterLink href="/docs">Documentation</FooterLink>
            <FooterLink href="/docs/supported-github-events">
              Supported GitHub events
            </FooterLink>
            <FooterLink href="/docs/habitica-api-token">
              Habitica API token
            </FooterLink>
            <FooterLink href="/docs/how-to-contribute">Contributing</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href={githubRepositoryUrl()} target="_blank">
              GitHub repo
            </FooterLink>
          </div>

          <div className="flex flex-col gap-2.5 lg:col-span-2">
            <FooterHeading>Legal</FooterHeading>
            <FooterLink href="/imprint">Imprint</FooterLink>
            <FooterLink href="/privacy-policy">Privacy policy</FooterLink>
            <FooterLink href="/terms-and-conditions">Terms</FooterLink>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3.5">
            <span>
              &copy; {currentYear} Octogriffin. Not affiliated with Habitica.
            </span>
            {!!version && (
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 font-mono text-xs text-text-2">
                <Link
                  className="transition-colors duration-[var(--dur-fast)] hover:text-text"
                  href={githubRepositoryUrl(`/releases/tag/web-v${version}`)}
                  rel="noreferrer"
                  target="_blank"
                >
                  v{version}
                </Link>
                {!!commit && (
                  <>
                    <span aria-hidden="true" className="text-faint">
                      ·
                    </span>
                    <Link
                      aria-label={`Commit ${commit}`}
                      className="text-muted transition-colors duration-[var(--dur-fast)] hover:text-text"
                      href={githubRepositoryUrl(`/commit/${commitSha}`)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {commit}
                    </Link>
                  </>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Made with
              <HugeiconsIcon
                aria-label="love"
                className="fill-hp text-hp"
                icon={FavouriteIcon}
                role="img"
                size={14}
              />
              by
              <Link
                className="font-medium text-text transition-colors duration-[var(--dur-fast)] hover:text-accent-text"
                href="https://www.bebic.dev"
                rel="noreferrer"
                target="_blank"
              >
                Drazen Bebic
              </Link>
              in Vienna
            </span>
            <div className="flex gap-0.5">
              {socials.map(({ href, icon, label }) => (
                <Tooltip content={label} key={label} type="label">
                  <Link
                    aria-label={label}
                    className="grid h-8 w-8 place-items-center rounded-[8px] text-text-2 transition-colors duration-[var(--dur-fast)] hover:bg-fill hover:text-text"
                    href={href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <HugeiconsIcon icon={icon} size={16} />
                  </Link>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </Shell>
    </footer>
  );
};
