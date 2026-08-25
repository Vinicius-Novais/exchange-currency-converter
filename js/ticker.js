import { SUPPORTED_CURRENCIES } from "./constants.js";
import { state } from "./state.js";

import { getDailyVariation, formatRate } from "./utils.js";
const TICKER_BASES = ["EUR", "BRL", "USD", "GBP"];

export const setupTicker = function () {
  renderTicker();
};

const renderTicker = function () {
  const pairs = generatePairs();

  const li = pairs
    .map(({ base, quote }) => {
      const rateToday = state.ratesEUR[quote] / state.ratesEUR[base];
      const rateYesterday = state.ratesEURYesterday[quote] / state.ratesEURYesterday[base];
      const variation = getDailyVariation(rateToday, rateYesterday);

      console.log(variation);
      return ` <li class="ticker__li">
            <span class="ticker__pair">${base}/${quote}</span>
            <span class="ticker__price">${formatRate(rateToday)}</span>
            <span class="ticker__daily-change ticker__daily-change--${parseFloat(variation) === 0 ? "" : parseFloat(variation) >= 0 ? "up" : "down"}">${variation}</span>
          </li>`;
    })
    .join("");

  document.querySelectorAll(".ticker__ul").forEach((ul) => {
    ul.innerHTML = li;
  });

  console.log(li);
  document.querySelector(".ticker__ul").insertAdjacentHTML("afterbegin", li);
};
const generatePairs = () => {
  const pairs = [];

  SUPPORTED_CURRENCIES.forEach((quote) => {
    const base = TICKER_BASES[Math.floor(Math.random() * TICKER_BASES.length)];
    if (base !== quote) pairs.push({ base, quote });
  });

  return pairs;
};
