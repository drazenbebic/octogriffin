import { currencyForCountry, currencyFromHeaders } from './viewerCurrency';

describe('viewerCurrency', () => {
  it('shows euros in the eurozone and dollars everywhere else', () => {
    expect(currencyForCountry('AT')).toBe('EUR');
    expect(currencyForCountry('de')).toBe('EUR');
    expect(currencyForCountry('US')).toBe('USD');
    expect(currencyForCountry('GB')).toBe('USD');
    expect(currencyForCountry(null)).toBe('USD');
  });

  it("prefers Vercel's IP country over the browser language", () => {
    const headers = new Headers({
      'accept-language': 'de-AT,de;q=0.9',
      'x-vercel-ip-country': 'US',
    });

    expect(currencyFromHeaders(headers)).toBe('USD');
  });

  it('falls back to the region of the first language', () => {
    expect(
      currencyFromHeaders(new Headers({ 'accept-language': 'de-AT,en;q=0.8' })),
    ).toBe('EUR');
    expect(currencyFromHeaders(new Headers({ 'accept-language': 'en' }))).toBe(
      'USD',
    );
  });
});
