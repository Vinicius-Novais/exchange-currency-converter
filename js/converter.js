import { state } from "./state.js";
import { renderTriggerBtn } from "./picker.js";
const [sendInput, receiveInput] = document.querySelectorAll(".converter__amount");
const [sendBtn, receiveBtn] = document.querySelectorAll(".converter__currency-btn");
const exchangeRateEl = document.querySelector(".converter__rate");
const swapBtn = document.querySelector(".converter__swap-btn");

export const setupConverter = function () {
  sendInput.addEventListener("input", () => {
    updateConversion();
  });

  sendInput.addEventListener("keydown", (e) => {
    const allowed = /[0-9.]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/;
    if (!allowed.test(e.key)) e.preventDefault();
  });

  swapBtn.addEventListener("click", (e) => {
    setupSwap();
  });

  //Chamada inicial para carregar o exchangePair
  updateConversion();
};

export const updateConversion = function () {
  updateExchangePair();
  if (!Number.isFinite(Number(sendInput.value)) || Number(sendInput.value) === 0) {
    receiveInput.value = "";
    return;
  }

  state.amount = Number(sendInput.value);
  console.log(state.amount);

  //converterInput
  const rate = state.rates[state.receiveCurrency];
  const result = state.amount * rate;

  receiveInput.value = new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(result);

  //Swap button
};

const updateExchangePair = function () {
  //Update exchange pair
  exchangeRateEl.textContent = `1 ${state.sendCurrency} = ${state.rates[state.receiveCurrency]} ${state.receiveCurrency}`;
};

const setupSwap = function () {
  updateConversion();
  
  [(state.receiveCurrency, state.sendCurrency)] = [state.sendCurrency, state.receiveCurrency];
  renderTriggerBtn(sendBtn, () => state.sendCurrency);
  renderTriggerBtn(receiveBtn, () => state.receiveCurrency);
};
