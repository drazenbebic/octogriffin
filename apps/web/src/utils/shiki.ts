import { h } from 'hastscript';
import {
  BundledLanguage,
  createHighlighter,
  makeSingletonHighlighter,
  ShikiTransformer,
} from 'shiki';

import { cn } from '@/utils/cn';

const getHighlighter = makeSingletonHighlighter(createHighlighter);

export const THEME_DARK = 'github-dark';
export const THEME_LIGHT = 'github-light';

export const copyCodeButtonTransformer: ShikiTransformer = {
  name: 'copy-code-button-transformer',
  pre(node) {
    const button = h(
      'button',
      {
        'aria-label': 'Copy code',
        type: 'button',
        class: cn(
          'copy-button group',
          'absolute top-3 right-3 z-20',
          'flex items-center justify-center p-1.5',
          'rounded-md border',
          'border-gray-200 bg-white/50 text-gray-500 backdrop-blur-sm hover:bg-white hover:text-black',
          'dark:border-white/10 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white',
          'transition-all duration-200 ease-in-out',
          'cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100',
        ),
        onclick: `
          const code = this.parentElement.querySelector('code');
          const text = code ? code.innerText : this.parentElement.innerText;
          navigator.clipboard.writeText(text);
          this.classList.add('copied');
          this.setAttribute('aria-label', 'Copied!');
          setTimeout(() => {
            this.classList.remove('copied');
            this.setAttribute('aria-label', 'Copy code');
          }, 2000);
        `,
      },
      [
        // Default Icon
        h(
          'svg',
          {
            class: cn('w-4 h-4', 'block [.copied_&]:hidden'),
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'aria-hidden': 'true',
          },
          [
            h('rect', {
              width: '14',
              height: '14',
              x: '8',
              y: '8',
              rx: '2',
              ry: '2',
            }),
            h('path', {
              d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2',
            }),
          ],
        ),
        // Success Icon
        h(
          'svg',
          {
            class: cn('w-4 h-4 text-emerald-500', 'hidden [.copied_&]:block'),
            viewBox: '0 0 24 24',
            fill: 'none',
            xmlns: 'http://www.w3.org/2000/svg',
            'aria-hidden': 'true',
          },
          [
            h('path', {
              d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
              fill: 'currentColor',
            }),
          ],
        ),
      ],
    );

    node.properties.class = cn(node.properties.class, 'group');
    node.children.push(button);
  },
};

export const codeToHtml = async ({
  code,
  language,
}: {
  code: string;
  language: BundledLanguage;
}) => {
  const highlighter = await getHighlighter({
    themes: [THEME_LIGHT, THEME_DARK],
    langs: [
      'javascript',
      'typescript',
      'json',
      'html',
      'css',
      'php',
      'shell',
      'bash',
      'yml',
    ],
  });

  return highlighter.codeToHtml(code, {
    lang: language,
    themes: {
      dark: THEME_DARK,
      light: THEME_LIGHT,
    },
    transformers: [copyCodeButtonTransformer],
  });
};
