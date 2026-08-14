import { state } from "./state.js";
import { addFavorite, updateConversion } from "./converter.js";
import { renderBadge } from "./visibility.js";
import { formatRate } from "./utils.js";
import { renderEmptyState, hideEmptyState } from "./utils.js";
const compareTabButton = document.querySelector(".dashboard__compare-btn");
const compareDDButton = document.querySelector('[data-tab="compare"]');
const compareUl = document.querySelector(".dashboard__compare-list");
const comparePair = document.querySelector(".dashboard__compare-pairs");
const sendInput = document.querySelector("#send-input");
const favBtn = document.querySelector(".converter__fav-btn");
const receiveBtn = document.querySelectorAll(".converter__currency-btn")[1];
const converterEl = document.querySelector(".converter");

export const setupCompare = function () {
  compareTabButton.addEventListener("click", () => {
    renderComparePanel();
  });

  compareDDButton.addEventListener("click", () => {
    if (state.activeTab !== "compare") return;

    renderComparePanel();
  });

  sendInput.addEventListener("input", () => {
    if (state.activeTab !== "compare") return;
    renderComparePanel();

    //Ao apagar tudo colocar a página de empty state
  });

  compareUl.addEventListener("click", (e) => {
    addFavoriteCompare(e);
    setConverterPairCompare(e);
  });
};

export const renderComparePanel = function () {
  if (state.amount === 0) {
    renderEmptyState("compare");
    return;
  }

  hideEmptyState("compare");

  renderCompareHeader();
  let li = "";

  compareUl.innerHTML = "";

  Object.entries(state.rates)
    .filter(([code]) => code !== state.sendCurrency)
    .forEach(([code, rate]) => {
      const isFavorite = state.favorites.includes(`${state.sendCurrency}/${code}`);

      li += `
    <li class="dashboard__compare-item dashboard__item">
                <div class="dashboard__compare-left">
                  <img src="/assets/images/flags/${code.slice(0, -1).toLowerCase()}.webp" alt="${code} flag" class="dashboard__compare-flag" />
                  <div class="dashboard__compare-currency">
                    <span class="dashboard__compare-code">${code}</span>
                    <span class="dashboard__compare-name">${state.currencies[code]}</span>
                  </div>
                </div>
                <div class="dashboard__compare-right">
                  <div class="dashboard__compare-value-rate">
                    <span class="dashboard__compare-value">${formatRate(state.amount * rate)}</span>
                    <span class="dashboard__compare-rate">@ ${rate}</span>
                  </div>
                  <button aria-pressed="${isFavorite}" class="dashboard__compare-fav-btn dashboard__fav-btn">
                    <svg class="dashboard__compare-icon-empty" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path
                        fill="currentColor"
                        d="M13.637 6.02c.61.094.843.844.398 1.29l-2.46 2.413.585 3.399c.094.61-.562 1.078-1.101.797l-3.047-1.617-3.07 1.617c-.54.28-1.196-.188-1.102-.797l.586-3.399L1.965 7.31c-.446-.445-.211-1.195.398-1.289l3.446-.492 1.523-3.117c.281-.563 1.078-.54 1.336 0l1.547 3.117zm-3.282 3.305 2.368-2.297-3.258-.469-1.453-2.953L6.535 6.56l-3.258.469 2.367 2.297-.562 3.234 2.93-1.523 2.906 1.523z"
                      />
                    </svg>
                    <svg class="dashboard__compare-icon-filled" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path fill="#cef739" d="M7.332 2.41c.281-.562 1.078-.538 1.336 0l1.547 3.118 3.422.492c.61.094.843.844.398 1.29l-2.46 2.413.585 3.399c.094.61-.562 1.078-1.101.797l-3.047-1.617-3.07 1.617c-.54.28-1.196-.188-1.102-.797l.586-3.399L1.965 7.31c-.446-.445-.211-1.195.398-1.289l3.446-.492z" />
                    </svg>
                  </button>
                </div>
              </li>
    
    
    
    `;
    });

  compareUl.insertAdjacentHTML("beforeend", li);
};

export const renderCompareHeader = function () {
  //Render header
  document.querySelector(".dashboard__compare-from").textContent = `${new Intl.NumberFormat(navigator.language, {
    maximumFractionDigits: 2,
  }).format(state.amount)} FROM ${state.sendCurrency}`;
};

const addFavoriteCompare = function (e) {
  const btn = e.target.closest("button");

  if (!btn) return;
  const clickedBtnCode = btn.closest("li").querySelector(".dashboard__compare-code").textContent;

  const pair = `${state.sendCurrency}/${clickedBtnCode}`;
  const isFavorite = state.favorites.includes(pair);

  if (!isFavorite) {
    state.favorites.push(pair);
    btn.setAttribute("aria-pressed", "true");

    renderBadge();

    if (state.receiveCurrency !== clickedBtnCode) return;

    favBtn.setAttribute("aria-pressed", "true");
  } else {
    btn.setAttribute("aria-pressed", "false");

    state.favorites.splice(state.favorites.indexOf(pair), 1);
    renderBadge();

    if (state.receiveCurrency !== clickedBtnCode) return;

    favBtn.setAttribute("aria-pressed", "false");
  }

  console.log(state);
};

const setConverterPairCompare = function (e) {
  if (e.target.closest("button")) return;

  const li = e.target.closest("li");

  if (!li) return;

  const clickedBtnCode = li.querySelector(".dashboard__compare-code").textContent;
  state.receiveCurrency = clickedBtnCode;
  updateConversion();

  const btnContent = `
   <img class="converter__flag-btn" src="assets/images/flags/${clickedBtnCode.slice(0, -1).toLowerCase()}.webp" alt="${clickedBtnCode.slice(0, -1)} flag" />
                <span class="converter__currency-name">${clickedBtnCode}</span>
                <svg class="converter__chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <path fill="#fff" d="M2.988 4.02h6.024c.422 0 .633.515.328.82l-3 3a.48.48 0 0 1-.68 0l-3-3c-.304-.305-.093-.82.328-.82" />
                </svg>
  `;

  receiveBtn.innerHTML = "";

  receiveBtn.insertAdjacentHTML("afterbegin", btnContent);
  converterEl.scrollIntoView({ behavior: "smooth" });
};
