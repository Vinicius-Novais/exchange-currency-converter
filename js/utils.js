export const formatRate = (rate) => {
  if (rate >= 1)
    return new Intl.NumberFormat(navigator.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);

  return new Intl.NumberFormat(navigator.language, {
    maximumSignificantDigits: 2,
  }).format(rate);
};
