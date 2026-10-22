import { sameSitePath } from './sameSitePath';

describe('sameSitePath', () => {
  it.each([
    ['https://octogriffin.com/dashboard?tab=history', '/dashboard?tab=history'],
    ['/docs#triggers', '/docs#triggers'],
    ['https://evil.example/phish', '/phish'],
    ['//evil.example/phish', '/phish'],
    ['/\\evil.example', '/'],
    ['http://[', '/'],
  ])('turns %s into %s', (url, path) => {
    expect(sameSitePath(url)).toBe(path);
  });
});
