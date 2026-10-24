import { activeNavigationHref } from './Navigation';

describe('activeNavigationHref', () => {
  it('lights up only Recipes on the recipes page, not Docs as well', () => {
    expect(activeNavigationHref('/docs/coding-habits')).toBe(
      '/docs/coding-habits',
    );
  });

  it('lights up Docs on other docs pages', () => {
    expect(activeNavigationHref('/docs/dev-setup')).toBe('/docs');
  });

  it('lights up nothing on pages outside the nav', () => {
    expect(activeNavigationHref('/dashboard')).toBeUndefined();
    expect(activeNavigationHref('/docsy')).toBeUndefined();
  });
});
