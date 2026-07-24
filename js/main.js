import { fetchAllRates, fetchSupportedCurrencies } from "./api.js";
import { state } from "./state.js";
import { setupPicker } from "./picker.js";
const [sendBtn, receiveBtn] = document.querySelectorAll(".converter__currency-btn");
const [sendPicker, receivePicker] = document.querySelectorAll(".converter__picker");

const init = async function () {
  try {
    // Api.js
    [state.currencies, state.rates] = await Promise.all([fetchSupportedCurrencies(), fetchAllRates(state.sendCurrency)]);

    console.log(state);

    //picker.js

    setupPicker(
      sendBtn,
      sendPicker,
      state.currencies,
      (currency) => {
        state.sendCurrency = currency;
      },
      () => state.sendCurrency,
    );

    setupPicker(
      receiveBtn,
      receivePicker,
      state.currencies,
      (currency) => {
        state.receiveCurrency = currency;
      },
      () => state.receiveCurrency,
    );
  } catch (err) {
    console.error("Failed to initialize app:", err.message);
  }
};

init();
