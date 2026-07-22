// prettier-ignore
export const SUPPORTED_CURRENCIES = [
  'AED', 'ARS', 'AUD', 'BDT', 'BHD', 'BRL',
  'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CZK', 'DKK',
  'EGP', 'EUR', 'GBP', 'HKD', 'HNL', 'HTG', 'HUF',
  'IDR', 'INR', 'ISK', 'JOD', 'JPY', 'KES', 'KRW',
  'KWD', 'LBP', 'LKR', 'MAD', 'MXN', 'MYR', 'NGN',
  'NOK', 'NPR', 'NZD', 'OMR', 'PEN', 'PHP', 'PKR',
  'PLN', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD',
  'THB', 'TRY', 'TWD', 'UAH', 'USD', 'VND', 'ZAR'
];

// export const TICKER_PAIRS = SUPPORTED_CURRENCIES.filter((code) => code !== "BRL").map((code) => ({ base: "BRL", quote: code }));

export const BASE_URL = `https://api.frankfurter.dev/v2`;

export const POPULAR_CURRENCIES = ["USD", "EUR", "GBP"];
