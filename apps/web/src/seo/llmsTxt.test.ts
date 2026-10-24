import { buildLlmsTxt } from './llmsTxt';
import { pagePaths, pageUrl } from './pageCatalog';

describe('buildLlmsTxt', () => {
  const text = buildLlmsTxt();

  it('opens with the project name and a one-paragraph summary', () => {
    expect(text.startsWith('# Octogriffin\n\n> ')).toBe(true);
  });

  it('links every public page once, with its description', () => {
    for (const path of pagePaths.filter(path => path !== '/')) {
      const occurrences = text.split(`](${pageUrl(path)})`).length - 1;

      expect(occurrences).toBe(1);
    }

    expect(text).toContain(
      `- [Development Standards](${pageUrl('/docs/development-standards')}): The conventions behind Octogriffin`,
    );
  });

  it('keeps legal pages in the optional section', () => {
    const optional = text.slice(text.indexOf('## Optional'));

    expect(optional).toContain(pageUrl('/privacy-policy'));
    expect(optional).toContain(pageUrl('/imprint'));
    expect(optional).not.toContain(pageUrl('/roadmap'));
  });
});
