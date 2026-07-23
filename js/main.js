import { fetchAllRates, fetchSupportedCurrencies } from "./api.js";
import { state } from "./state.js";

const init = async function () {
  [state.currencies, state.rates] = await Promise.all([fetchSupportedCurrencies(), fetchAllRates(state.sendCurrency)]);
};

init();
