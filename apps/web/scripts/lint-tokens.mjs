// Fails when components use Tailwind's palette colours or dark: colour
// overrides instead of the design tokens in globals.css.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src', import.meta.url).pathname;
const ALLOW = '/* token: dialog edge */';
const PATTERNS = [
  /\b(?:slate|violet|rose|indigo|sky|emerald|amber|red|blue)-\d{2,3}\b/,
  /\bdark:(?:[\w-]+:)*(?:bg|text|border|ring|shadow|from|via|to)-/,
];

const files = dir =>
  readdirSync(dir).flatMap(name => {
    const path = join(dir, name);

    if (statSync(path).isDirectory()) {
      return name === 'generated' ? [] : files(path);
    }

    return /\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path) ? [path] : [];
  });

const problems = files(ROOT).flatMap(path =>
  readFileSync(path, 'utf8')
    .split('\n')
    .map((line, index) => ({ index, line }))
    .filter(
      ({ line }) =>
        !line.includes(ALLOW) && PATTERNS.some(pattern => pattern.test(line)),
    )
    .map(
      ({ index, line }) =>
        `${relative(process.cwd(), path)}:${index + 1}  ${line.trim()}`,
    ),
);

if (problems.length > 0) {
  console.error(
    `Use the design tokens from globals.css instead of palette colours:\n\n${problems.join('\n')}`,
  );
  process.exit(1);
}
