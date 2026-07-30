import { fetchAllRates, fetchSupportedCurrencies } from "./api.js";
import { state } from "./state.js";
import { setupPicker } from "./picker.js";
import { setupConverter, updateConversion } from "./converter.js";
const [sendBtn, receiveBtn] = document.querySelectorAll(".converter__currency-btn");
const [sendPicker, receivePicker] = document.querySelectorAll(".converter__picker");

const init = async function () {
  try {
    // Api.js
    [state.currencies, state.rates] = await Promise.all([fetchSupportedCurrencies(), fetchAllRates(state.sendCurrency)]);

    console.log(state);

    //Converter.js
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
      },
    );

    setupPicker(
      receiveBtn,
      receivePicker,
      () => state.receiveCurrency,
      (currency) => {
        state.receiveCurrency = currency;
        updateConversion();
      },
    );
  } catch (err) {
    console.error("Failed to initialize app:", err.message);
  }
};

init();
