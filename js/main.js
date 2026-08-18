import { fetchAllRates, fetchSupportedCurrencies, fetchRatesYesterday } from "./api.js";
import { state } from "./state.js";
import { setupPicker } from "./picker.js";
import { setupConverter, updateConversion } from "./converter.js";
import { setupVisibility } from "./visibility.js";
import { setupLogPanel } from "./log.js";
import { setupCompare, renderCompareHeader, renderComparePanel } from "./compare.js";
import { setupFavorites } from "./favorites.js";
import { setupHistory } from "./history.js";
import { setupCards, setupChartHeader } from "./history.js";

const [sendBtn, receiveBtn] = document.querySelectorAll(".converter__currency-btn");
const [sendPicker, receivePicker] = document.querySelectorAll(".converter__picker");

const init = async function () {
  try {
    // api.js
    [state.currencies, state.rates, state.ratesEUR, state.ratesEURYesterday] = await Promise.all([fetchSupportedCurrencies(), fetchAllRates(state.sendCurrency), fetchAllRates("EUR"), fetchRatesYesterday("EUR")]);

    console.log(state);

    //converter.js
    setupConverter();

    //picker.js
    setupPicker(
      sendBtn,
      sendPicker,
      () => state.sendCurrency,
      async (currency) => {
        state.sendCurrency = currency;
        state.rates = await fetchAllRates(currency);
        updateConversion();
        setupCards();
        setupChartHeader();

        if (state.activeTab !== "compare") return;

        renderCompareHeader();
        renderComparePanel();
      },
    );

    setupPicker(
      receiveBtn,
      receivePicker,
      () => state.receiveCurrency,
      (currency) => {
        state.receiveCurrency = currency;
        updateConversion();
        setupCards();
        setupChartHeader();
      },
    );

    //Setup visibility os tabs
    setupVisibility();

    //history.js

    setupHistory();

    //compare.js
    setupCompare();

    //favorites.js
    setupFavorites();

    //log.js
    setupLogPanel();
  } catch (err) {
    console.error("Failed to initialize app:", err.message);
  }
};

init();
