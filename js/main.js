import { state } from "./state.js";
import { fetchAllRates, fetchSupportedCurrencies, fetchRatesYesterday } from "./api.js";
import { setupTicker } from "./ticker.js";
import { setupPicker } from "./picker.js";
import { setupConverter, updateConversion } from "./converter.js";
import { setupVisibility } from "./visibility.js";
import { setupLogPanel } from "./log.js";
import { setupCompare, renderCompareHeader, renderComparePanel } from "./compare.js";
import { setupFavorites } from "./favorites.js";
import { setupCards, setupChartHeader, setupChart, selectRange, setupHistory } from "./history.js";
import { getLocalStorageItems, renderEmptyState } from "./utils.js";

const [sendBtn, receiveBtn] = document.querySelectorAll(".converter__currency-btn");
const [sendPicker, receivePicker] = document.querySelectorAll(".converter__picker");

const init = async function () {
  try {
    [state.currencies, state.rates, state.ratesEUR, state.ratesEURYesterday] = await Promise.all([fetchSupportedCurrencies(), fetchAllRates(state.sendCurrency), fetchAllRates("EUR"), fetchRatesYesterday("EUR")]);

    state.favorites = getLocalStorageItems("favorites") || [];
    state.log = getLocalStorageItems("log") || [];

    setupTicker();

    setupConverter();

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

        selectRange("1M").then((rangeData) => {
          state.rangeData = rangeData;
          setupChart();
        });

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
        selectRange("1M").then((rangeData) => {
          document.querySelectorAll("[data-range]").forEach((rangeBtn) => (rangeBtn.ariaSelected = false));
          document.querySelector("[data-range='1M']").ariaSelected = true;
          state.rangeData = rangeData;
          setupChart();
        });
      },
    );

    setupVisibility();

    setupHistory();

    setupCompare();

    setupFavorites();

    setupLogPanel();
  } catch (err) {
    renderEmptyState("history");
    console.error("Failed to initialize app:", err.message);
  }
};

init();
