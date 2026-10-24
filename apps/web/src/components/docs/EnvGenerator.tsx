'use client';

import type { FC } from 'react';
import { useState } from 'react';

import {
  CheckmarkCircle02Icon,
  Copy01Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/Button';

function generateRandomString() {
  if (typeof window === 'undefined') {
    return '';
  }

  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);

  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function generateValues() {
  return {
    encryption: generateRandomString(),
    health: generateRandomString(),
    nextAuth: generateRandomString(),
    webhook: generateRandomString(),
  };
}

export const EnvGenerator: FC = () => {
  const [copied, setCopied] = useState(false);
  const [secrets, setSecrets] = useState(() => generateValues());

  const handleRegenerate = () => {
    setSecrets(generateValues());
    setCopied(false);
  };

  const envBlock = `
# Generated Security Keys
GITHUB_WEBHOOK_SECRET="${secrets.webhook}"
NEXTAUTH_SECRET="${secrets.nextAuth}"
ENCRYPTION_KEY="${secrets.encryption}"
HEALTH_CHECK_SECRET="${secrets.health}"

# Paste your GitHub App Credentials here
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Paste your GitHub App URL here 
NEXT_PUBLIC_GITHUB_APP_URL="https://github.com/apps/my-github-app"
`.trim();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(envBlock);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-lg border border-border bg-sunken">
        {/* Header / Actions */}
        <div className="flex items-center justify-between border-b border-border bg-fill px-4 py-2">
          <span className="text-xs font-mono text-muted">
            apps/web/.env.local
          </span>
          <div className="flex items-center gap-2">
            <Button
              className="h-7 px-2 text-xs"
              onClick={handleRegenerate}
              size="sm"
              variant="ghost"
            >
              <HugeiconsIcon className="mr-1.5" icon={RefreshIcon} size={14} />
              Regenerate
            </Button>
            <Button
              className="h-7 px-2 text-xs"
              onClick={copyToClipboard}
              size="sm"
              variant="secondary"
            >
              {copied ? (
                <HugeiconsIcon
                  className="mr-1.5 text-ok"
                  icon={CheckmarkCircle02Icon}
                  size={14}
                />
              ) : (
                <HugeiconsIcon className="mr-1.5" icon={Copy01Icon} size={14} />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Code Block */}
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-text sm:text-sm">
          <code>
            <span className="text-muted"># Generated Security Keys</span>
            {'\n'}
            <span className="text-accent-text">GITHUB_WEBHOOK_SECRET</span>
            {'='}
            <span className="text-ok">&#34;{secrets.webhook}&#34;</span>
            {'\n'}
            <span className="text-accent-text">NEXTAUTH_SECRET</span>
            {'='}
            <span className="text-ok">&#34;{secrets.nextAuth}&#34;</span>
            {'\n'}
            <span className="text-accent-text">ENCRYPTION_KEY</span>
            {'='}
            <span className="text-ok">&#34;{secrets.encryption}&#34;</span>
            {'\n'}
            <span className="text-accent-text">HEALTH_CHECK_SECRET</span>
            {'='}
            <span className="text-ok">&#34;{secrets.health}&#34;</span>
            {'\n\n'}
            <span className="text-muted">
              # Paste your GitHub App Credentials here
            </span>
            {'\n'}
            <span className="text-accent-text">GITHUB_CLIENT_ID</span>
            {'=""'}
            {'\n'}
            <span className="text-accent-text">GITHUB_CLIENT_SECRET</span>
            {'=""'}
            {'\n\n'}
            <span className="text-muted"># Paste your GitHub App URL here</span>
            {'\n'}
            <span className="text-accent-text">NEXT_PUBLIC_GITHUB_APP_URL</span>
            {'="https://github.com/apps/my-github-app"'}
          </code>
        </pre>
      </div>
    </div>
  );
};
