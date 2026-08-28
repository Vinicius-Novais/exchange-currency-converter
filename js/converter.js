import { state } from "./state.js";
import { renderTriggerBtn } from "./picker.js";
import { fetchAllRates } from "./api.js";
import { renderBadge } from "./visibility.js";
import { renderLogPanel } from "./log.js";
import { renderComparePanel, renderCompareHeader } from "./compare.js";
import { renderFavoritePanel } from "./favorites.js";
import { formatRate, saveLocalStorageState } from "./utils.js";
const [sendInput, receiveInput] = document.querySelectorAll(".converter__amount");
const [sendBtn, receiveBtn] = document.querySelectorAll(".converter__currency-btn");
const exchangeRateEl = document.querySelector(".converter__rate");
const swapBtn = document.querySelector(".converter__swap-btn");
const favBtn = document.querySelector(".converter__fav-btn");
const logBtn = document.querySelector(".converter__log-btn");

export const setupConverter = function () {
  sendInput.addEventListener("input", () => {
    updateConversion();
  });

  sendInput.addEventListener("keydown", (e) => {
    const allowed = /[0-9.]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/;
    if (!allowed.test(e.key)) e.preventDefault();
  });

  swapBtn.addEventListener("click", () => {
    setupSwap();
  });

  favBtn.addEventListener("click", (e) => {
    addFavorite();
  });

  logBtn.addEventListener("click", (e) => {
    addLogConversion();
    renderBadge();

    logBtn.style.pointerEvents = "none";

    logBtn.setAttribute("data-logged", "");
    setTimeout(() => {
      logBtn.style.pointerEvents = "auto";
      logBtn.removeAttribute("data-logged");
    }, 700);
  });

  //Chamada inicial para carregar o exchangePair
  updateConversion();
};

export const updateConversion = function () {
  updateExchangePair();
  if (!Number.isFinite(Number(sendInput.value)) || Number(sendInput.value) === 0) {
    receiveInput.value = "";
    state.amount = 0;
    logBtn.setAttribute("disabled", "");
    return;
  }

  //Enable log Button

  logBtn.removeAttribute("disabled");

  state.amount = Number(sendInput.value);

  //converterInput
  const rate = state.rates[state.receiveCurrency];
  const result = state.amount * rate;

  receiveInput.value = formatRate(result);
};

const updateExchangePair = function () {
  //Update exchange pair
  exchangeRateEl.textContent = `1 ${state.sendCurrency} = ${state.rates[state.receiveCurrency]} ${state.receiveCurrency}`;

  const pair = `${state.sendCurrency}/${state.receiveCurrency}`;
  favBtn.setAttribute("aria-pressed", state.favorites.includes(pair));
};

const setupSwap = async function () {
  [state.receiveCurrency, state.sendCurrency] = [state.sendCurrency, state.receiveCurrency];

  renderTriggerBtn(sendBtn, () => state.sendCurrency);
  renderTriggerBtn(receiveBtn, () => state.receiveCurrency);

  state.rates = await fetchAllRates(state.sendCurrency);

  updateConversion();

  if (state.activeTab !== "compare") return;

  renderComparePanel();
};

export const addFavorite = function () {
  const pair = `${state.sendCurrency}/${state.receiveCurrency}`;
  const isFavorite = state.favorites.includes(pair);

  if (!isFavorite) {
    state.favorites.push(pair);
    favBtn.setAttribute("aria-pressed", "true");
    renderBadge();
  } else {
    favBtn.setAttribute("aria-pressed", "false");
    state.favorites.splice(state.favorites.indexOf(pair), 1);
    renderBadge();
  }

  saveLocalStorageState("favorites", state.favorites);

  if (state.activeTab === "compare") {
    renderComparePanel();
  }

  if (state.activeTab === "favorites") {
    renderFavoritePanel();
  }
};

export const addLogConversion = function () {
  state.log.push({ id: crypto.randomUUID(), send: { code: state.sendCurrency, amount: sendInput.value }, receive: { code: state.receiveCurrency, amount: receiveInput.value }, timeStamp: Date.now() });
  saveLocalStorageState("log", state.log);

  if (state.activeTab !== "log") return;

  renderLogPanel();
};
