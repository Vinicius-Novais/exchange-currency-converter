import { state } from "./state.js";
import { renderBadge } from "./visibility.js";
import { formatRate, getDailyVariation } from "./utils.js";
import { renderEmptyState, hideEmptyState } from "./utils.js";
import { updateConversion } from "./converter.js";
import { fetchAllRates } from "./api.js";

const favoritesTabButton = document.querySelector(".dashboard__favorites-btn");
const favoritesDDButton = document.querySelector("[data-tab='favorites']");
const favoritesUl = document.querySelector(".dashboard__favorites-list");
const favoritesCount = document.querySelector(".dashboard__favorites-count");
const favConverterBtn = document.querySelector(".converter__fav-btn");
const sendBtn = document.querySelectorAll(".converter__currency-btn")[0];
const receiveBtn = document.querySelectorAll(".converter__currency-btn")[1];
const converterEl = document.querySelector(".converter");
const sendInput = document.querySelector(".converter__amount");

export const setupFavorites = function () {
  favoritesTabButton.addEventListener("click", () => {
    renderFavoritePanel();
  });
  favoritesDDButton.addEventListener("click", () => {
    renderFavoritePanel();
  });

  favoritesUl.addEventListener("click", (e) => {
    removeFavorite(e);
    setConverterPairFavorites(e);
  });
};

export const renderFavoritePanel = function () {
  if (state.favorites.length === 0) {
    renderEmptyState("favorites");
    return;
  }

  hideEmptyState("favorites");

  console.log("Taxa de hoje do EUR:", state.ratesEUR["EUR"]);
  console.log("Taxa de ontem do EUR:", state.ratesEURYesterday["EUR"]);
  favoritesCount.textContent = `${state.favorites.length} FAVORITES`;
  let li = "";
  state.favorites.forEach((pair) => {
    const [send, receive] = pair.split("/");

    const rateToday = state.ratesEUR[receive] / state.ratesEUR[send];
    const rateYesterday = state.ratesEURYesterday[receive] / state.ratesEURYesterday[send];

    const variation = getDailyVariation(rateToday, rateYesterday);
    const variationClass = variation === "0.00%" ? "" : parseFloat(variation) >= 0 ? "positive" : "negative";
    console.log(parseFloat(variation));
    li += `
        <li data-pair="${send}/${receive}" class="dashboard__favorites-item dashboard__item">
                <span class="dashboard__favorites-pair"
                  >${send}
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 11 11">
                    <path fill="#9d9d9d" d="M5.11.088c.093-.117.28-.117.398 0l4.898 4.898a.27.27 0 0 1 0 .399l-4.898 4.898c-.117.117-.305.117-.399 0l-.468-.445c-.118-.117-.118-.305 0-.399l3.632-3.656H.281A.27.27 0 0 1 0 5.502v-.656c0-.14.117-.282.281-.282h7.992L4.641.932c-.118-.094-.118-.282 0-.399z" />
                  </svg>
                  ${receive}</span
                >
                <div class="dashboard__favorites-data">
                  <span class="dashboard__favorites-rate">${formatRate(rateToday)}</span>
                  <span class="dashboard__favorites-change dashboard__value--${variationClass}">${variation}</span>
                </div>
                <button aria-pressed="true" class="dashboard__favorites-fav-btn dashboard__fav-btn">
                  <svg class="dashboard__favorites-icon-empty" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      d="M13.637 6.02c.61.094.843.844.398 1.29l-2.46 2.413.585 3.399c.094.61-.562 1.078-1.101.797l-3.047-1.617-3.07 1.617c-.54.28-1.196-.188-1.102-.797l.586-3.399L1.965 7.31c-.446-.445-.211-1.195.398-1.289l3.446-.492 1.523-3.117c.281-.563 1.078-.54 1.336 0l1.547 3.117zm-3.282 3.305 2.368-2.297-3.258-.469-1.453-2.953L6.535 6.56l-3.258.469 2.367 2.297-.562 3.234 2.93-1.523 2.906 1.523z"
                    />
                  </svg>
                  <svg class="dashboard__favorites-icon-filled" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path fill="#cef739" d="M7.332 2.41c.281-.562 1.078-.538 1.336 0l1.547 3.118 3.422.492c.61.094.843.844.398 1.29l-2.46 2.413.585 3.399c.094.61-.562 1.078-1.101.797l-3.047-1.617-3.07 1.617c-.54.28-1.196-.188-1.102-.797l.586-3.399L1.965 7.31c-.446-.445-.211-1.195.398-1.289l3.446-.492z" />
                  </svg>
                </button>
              </li>
              `;
  });

  favoritesUl.innerHTML = "";

  favoritesUl.insertAdjacentHTML("afterbegin", li);
};

const removeFavorite = function (e) {
  const btn = e.target.closest("button");

  if (!btn) return;

  const li = btn.closest("li");

  const pair = li.dataset.pair;

  console.log(pair);

  state.favorites.splice(state.favorites.indexOf(pair), 1);

  favConverterBtn.setAttribute("aria-pressed", "false");

  renderFavoritePanel();
  renderBadge();

  console.log(state);
};

const setConverterPairFavorites = async function (e) {
  if (e.target.closest("button")) return;

  const li = e.target.closest("li");

  if (!li) return;

  const pair = li.dataset.pair;
  const [sendCode, receiveCode] = pair.split("/");
  [state.sendCurrency, state.receiveCurrency] = [sendCode, receiveCode];
  sendInput.value = 1;

  try {
    state.rates = await fetchAllRates(sendCode);
    updateConversion();
    console.log(state);
  } catch (error) {
    console.error("Error during fetch of all rates through favorites item:", error);

    return;
  }

  const btnContentSend = `
   <img class="converter__flag-btn" src="assets/images/flags/${sendCode.slice(0, -1).toLowerCase()}.webp" alt="${sendCode} flag" />
                <span class="converter__currency-name">${sendCode}</span>
                <svg class="converter__chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <path fill="#fff" d="M2.988 4.02h6.024c.422 0 .633.515.328.82l-3 3a.48.48 0 0 1-.68 0l-3-3c-.304-.305-.093-.82.328-.82" />
                </svg>
  `;

  const btnContentReceive = `
   <img class="converter__flag-btn" src="assets/images/flags/${receiveCode.slice(0, -1).toLowerCase()}.webp" alt="${receiveCode.slice(0, -1)} flag" />
                <span class="converter__currency-name">${receiveCode}</span>
                <svg class="converter__chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <path fill="#fff" d="M2.988 4.02h6.024c.422 0 .633.515.328.82l-3 3a.48.48 0 0 1-.68 0l-3-3c-.304-.305-.093-.82.328-.82" />
                </svg>
  `;

  sendBtn.innerHTML = "";
  receiveBtn.innerHTML = "";

  sendBtn.insertAdjacentHTML("beforeend", btnContentSend);
  receiveBtn.insertAdjacentHTML("beforeend", btnContentReceive);
  converterEl.scrollIntoView({ behavior: "smooth" });
};
