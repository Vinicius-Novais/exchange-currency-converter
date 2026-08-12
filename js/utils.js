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

export const getDailyVariation = function (rateToday, rateYesterday) {
  const change = ((rateToday - rateYesterday) / rateYesterday) * 100;
  console.log(rateToday);
  console.log(rateYesterday);
  console.log(change);
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
};
