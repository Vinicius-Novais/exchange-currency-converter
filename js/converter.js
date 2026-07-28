import { state } from "./state.js";

export const updateConversion = function () {
  console.log(state);
  const exchangeRateEl = document.querySelector(".converter__rate");

  exchangeRateEl.textContent = `1 ${state.sendCurrency} = ${state.rates[state.receiveCurrency]}`;
};
