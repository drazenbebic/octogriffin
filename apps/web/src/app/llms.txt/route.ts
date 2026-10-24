import { buildLlmsTxt } from '@/seo/llmsTxt';

export const dynamic = 'force-static';

export const GET = () =>
  new Response(buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
