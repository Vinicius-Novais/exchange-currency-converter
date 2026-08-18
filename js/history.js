import { state } from "./state.js";
import { fetchSeries } from "./api.js";
import { getDailyVariation, getLastBusinessDay, formatRate } from "./utils.js";

const openCardEl = document.querySelector(".dashboard__open-card .dashboard__value-card");
const lastCardEl = document.querySelector(".dashboard__last-card .dashboard__value-card");
const changeCardEl = document.querySelector(".dashboard__change-card .dashboard__value-card");
const percentageCardEl = document.querySelector(".dashboard__percentage-card .dashboard__value-card");
const chartPair = document.querySelector(".dashboard__chart-pair");
const chartCurrentValue = document.querySelector(".dashboard__chart-current-value");
const chartDate = document.querySelector(".dashboard__chart-date");
const chartCanvas = document.querySelector(".dashboard__chart-canvas");

export const setupHistory = function () {
  //Setup cards ao carregar o site
  setupCards();

  setupChartHeader();
  // setupChart();
};

export const setupCards = async function () {
  const daysArr = await fetchSeries(state.sendCurrency, state.receiveCurrency, getLastBusinessDay());
  const openRate = daysArr[0].rate;
  const lastRate = daysArr[daysArr.length - 1].rate;

  const dayliVariation = getDailyVariation(lastRate, openRate);

  console.log(dayliVariation);

  openCardEl.textContent = openRate;
  lastCardEl.textContent = lastRate;
  const change = lastRate - openRate;
  changeCardEl.textContent = Math.abs(change) < 0.00005 ? "0.0000" : formatRate(change);

  percentageCardEl.textContent = dayliVariation;

  const variation = parseFloat(dayliVariation) > 0 ? "positive" : parseFloat(dayliVariation) < 0 ? "negative" : "";

  console.log(variation);

  percentageCardEl.classList.remove("dashboard__value--positive", "dashboard__value--negative");
  changeCardEl.classList.remove("dashboard__value--positive", "dashboard__value--negative");
  if (!variation) return;

  percentageCardEl.classList.add(`dashboard__value--${variation}`);
  changeCardEl.classList.add(`dashboard__value--${variation}`);

  console.log(openRate, lastRate);
};

// Chart
export const setupChartHeader = function (currentValue) {
  const currentPair = `${state.sendCurrency}/${state.receiveCurrency}`;

  chartPair.textContent = currentPair;
  chartCurrentValue.textContent = state.rates[state.receiveCurrency];
};
