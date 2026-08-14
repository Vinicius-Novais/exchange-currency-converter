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

export const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "BRL"];

export const EMPTY_STATES = {
  history: { title: "No chart data available", message: "We couldn't load rate history right now. This usually clears up in a minute." },
  compare: { title: "No data to compare", message: "Enter an amount in SEND above to see what your money is worth in other currencies." },
  favorites: { title: "No pinned pairs yet", message: "Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row." },
  log: { title: "No conversions logged yet", message: "Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this session and this browser." },
};
