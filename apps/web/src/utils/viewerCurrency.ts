import type { Currency } from '@/config/sponsors';

// Countries that pay in euros, including the microstates that use it
const EURO_COUNTRIES = new Set([
  'AD',
  'AT',
  'BE',
  'BG',
  'CY',
  'DE',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MC',
  'ME',
  'MT',
  'NL',
  'PT',
  'SI',
  'SK',
  'SM',
  'VA',
  'XK',
]);

export const currencyForCountry = (country?: null | string): Currency =>
  country && EURO_COUNTRIES.has(country.toUpperCase()) ? 'EUR' : 'USD';

/**
 * The visitor's currency: Vercel's IP country, else the region of their first
 * language (de-AT), else dollars.
 */
export const currencyFromHeaders = (headers: Headers): Currency => {
  const country =
    headers.get('x-vercel-ip-country') ??
    headers.get('accept-language')?.match(/^[a-z]{2,3}-([a-z]{2})\b/i)?.[1];

  return currencyForCountry(country);
};
