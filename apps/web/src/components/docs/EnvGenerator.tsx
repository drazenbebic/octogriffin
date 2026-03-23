'use client';

import { FC, useState } from 'react';

import {
  CheckmarkCircle02Icon,
  Copy01Icon,
  RefreshIcon,
} from 'hugeicons-react';

import { Button } from '@/components/ui/Button';

export const EnvGenerator: FC = () => {
  const [copied, setCopied] = useState(false);

  function generateRandomString() {
    if (typeof window === 'undefined') {
      return '';
    }

    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      '',
    );
  }

  function generateValues() {
    return {
      webhook: generateRandomString(),
      nextAuth: generateRandomString(),
      encryption: generateRandomString(),
      health: generateRandomString(),
    };
  }

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
      <div className="relative rounded-lg border border-slate-200 bg-slate-900 shadow-sm overflow-hidden dark:border-slate-800">
        {/* Header / Actions */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 dark:bg-slate-950/50">
          <span className="text-xs font-mono text-slate-400">
            apps/web/.env.local
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              className="h-7 px-2 text-xs text-slate-400 hover:text-white"
            >
              <RefreshIcon size={14} className="mr-1.5" />
              Regenerate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <CheckmarkCircle02Icon
                  size={14}
                  className="mr-1.5 text-emerald-600"
                />
              ) : (
                <Copy01Icon size={14} className="mr-1.5" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Code Block */}
        <pre className="overflow-x-auto p-4 text-xs sm:text-sm font-mono leading-relaxed text-slate-300">
          <code>
            <span className="text-slate-500"># Generated Security Keys</span>
            {'\n'}
            <span className="text-violet-400">GITHUB_WEBHOOK_SECRET</span>=
            <span className="text-emerald-400">
              &#34;{secrets.webhook}&#34;
            </span>
            {'\n'}
            <span className="text-violet-400">NEXTAUTH_SECRET</span>=
            <span className="text-emerald-400">
              &#34;{secrets.nextAuth}&#34;
            </span>
            {'\n'}
            <span className="text-violet-400">ENCRYPTION_KEY</span>=
            <span className="text-emerald-400">
              &#34;{secrets.encryption}&#34;
            </span>
            {'\n'}
            <span className="text-violet-400">HEALTH_CHECK_SECRET</span>=
            <span className="text-emerald-400">&#34;{secrets.health}&#34;</span>
            {'\n\n'}
            <span className="text-slate-500">
              # Paste your GitHub App Credentials here
            </span>
            {'\n'}
            <span className="text-violet-400">GITHUB_CLIENT_ID</span>=&#34;&#34;
            {'\n'}
            <span className="text-violet-400">GITHUB_CLIENT_SECRET</span>
            =&#34;&#34;
            {'\n\n'}
            <span className="text-slate-500">
              # Paste your GitHub App URL here
            </span>
            {'\n'}
            <span className="text-violet-400">NEXT_PUBLIC_GITHUB_APP_URL</span>
            =&#34;https://github.com/apps/my-github-app&#34;
          </code>
        </pre>
      </div>
    </div>
  );
};
