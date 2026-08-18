import { EMPTY_STATES } from "./constants.js";

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

export const getLastBusinessDay = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  }

  return date.toISOString().split("T")[0];
};

export const renderEmptyState = function (type) {
  const { title, message } = EMPTY_STATES[type];

  const activePanel = document.querySelector(`.dashboard__panel--${type}`);
  const emptyPanel = document.querySelector(".dashboard__panel--empty");

  activePanel.setAttribute("hidden", "");
  emptyPanel.removeAttribute("hidden");

  document.querySelector(".dashboard__empty-title").textContent = title;
  document.querySelector(".dashboard__empty-paragraph").textContent = message;
};

export const hideEmptyState = function (type) {
  const activePanel = document.querySelector(`.dashboard__panel--${type}`);
  const emptyPanel = document.querySelector(".dashboard__panel--empty");

  activePanel.removeAttribute("hidden");
  emptyPanel.setAttribute("hidden", "");
};
