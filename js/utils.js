import { EMPTY_STATES } from "./constants.js";

export const formatRate = (rate) => {
  if (rate >= 1)
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);

  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
  }).format(rate);
};

export const getDailyVariation = function (rateToday, rateYesterday) {
  const change = ((rateToday - rateYesterday) / rateYesterday) * 100;
  const rounded = parseFloat(change.toFixed(2));

  if (rounded === 0) return change !== 0 ? "< 0.01%" : "0.00%";
  if (Math.abs(rounded) < 0.01) return "0.00%";

  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(2)}%`;
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

export const saveLocalStorageState = function (key, value) {
  const currentItems = JSON.parse(localStorage.getItem(key)) || [];

  currentItems.push(value);
  localStorage.setItem(key, JSON.stringify(value));
};
export const getLocalStorageItems = function (key) {
  return JSON.parse(localStorage.getItem(key));
};
