import { fetchAllRates, fetchSupportedCurrencies } from "./api.js";
import { state } from "./state.js";
import { setupPicker } from "./picker.js";
import { updateConversion } from "./converter.js";
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
      () => state.sendCurrency,
      (currency) => {
        state.sendCurrency = currency;
       state.rates = await fetchAllRates(currency);
        updateConversion();
      },
    );

    setupPicker(
      receiveBtn,
      receivePicker,
      () => state.receiveCurrency,
      async (currency) => {
        state.receiveCurrency = currency;
       state.rates = await fetchAllRates(currency);
        updateConversion();
      },
    );
  } catch (err) {
    console.error("Failed to initialize app:", err.message);
  }
};

init();
//BUG PRECISO FAZER O RATES E VER COMO FUNCIOPNA AS FUNCOES AWAIT FETCHALLRATES PQ A REQUISIÇÃO SO TA SENDO 1 VEZ NO COMEÇO 