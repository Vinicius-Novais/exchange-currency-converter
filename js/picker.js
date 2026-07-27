import { SUPPORTED_CURRENCIES, POPULAR_CURRENCIES } from "./constants.js";
import { state } from "./state.js";

export const setupPicker = function (triggerBtn, pickerEl, getCurrentCurrency, setCurrentCurrency) {
  //Show/hide picker
  triggerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pickerEl.hidden = !pickerEl.hidden;

    if (pickerEl.hidden) return;

    pickerEl.querySelector("ul").innerHTML = "";
    renderPickerList(pickerEl, getCurrentCurrency);

    renderTriggerBtn(triggerBtn, getCurrentCurrency, setCurrentCurrency, pickerEl);
  });

  pickerEl.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    pickerEl.hidden = true;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || pickerEl.hidden) return;
    pickerEl.hidden = true;
  });

  renderTriggerBtn(triggerBtn, getCurrentCurrency);
};

const renderPickerList = function (pickerEl, getCurrentCurrency) {
  const currentCurrency = getCurrentCurrency();

  console.log(currentCurrency);
  const popularCurrencies = Object.fromEntries(POPULAR_CURRENCIES.map((code) => [code, state.currencies[code]]));

  const otherCurrencies = Object.fromEntries(Object.entries(state.currencies).filter(([code]) => !POPULAR_CURRENCIES.includes(code)));

  console.log(popularCurrencies);
  console.log(otherCurrencies);

  const svg = `
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
              </svg>
                 `;

  //HTML popular
  let popularCurrenciesHTML = `
                  <li class="converter__picker-heading">
                    <span>POPULAR</span>
                    <span class="converter__picker-count">${Object.entries(popularCurrencies).length}</span>
                  </li>`;

  Object.entries(popularCurrencies).forEach(([code, name]) => {
    popularCurrenciesHTML += `
                 <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/${code.slice(0, -1).toLowerCase()}.webp" alt="${code.slice(0, -1)} flag" />
                    <span class="converter__picker-code">${code}</span>
                    <span class="converter__picker-name">${name}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
                     </svg>
                  </li>`;
  });

  pickerEl.querySelector("ul").insertAdjacentHTML("afterbegin", popularCurrenciesHTML);

  console.log(popularCurrenciesHTML);

  //HTML other
  let otherCurrenciesHTML = `
                 <li class="converter__picker-heading">
                    <span>OTHER CURRENCIES</span>
                    <span class="converter__picker-count">${Object.entries(otherCurrencies).length}</span>
                  </li>
                  `;
  Object.entries(otherCurrencies).forEach(([code, name]) => {
    otherCurrenciesHTML += `
                <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/${code.slice(0, -1).toLowerCase()}.webp" alt="${code.slice(0, -1)} flag" />
                    <span class="converter__picker-code">${code}</span>
                    <span class="converter__picker-name">${name}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
                     </svg>
                 
                </li>`;
  });

  pickerEl.querySelector("ul").insertAdjacentHTML("beforeend", otherCurrenciesHTML);
};

const renderTriggerBtn = function (currencySelectBtn, getCurrentCurrency, setCurrentCurrency, pickerEl) {
  const currentCurrency = getCurrentCurrency();
  //Render button

  const btnContent = `
              <img class="converter__flag-btn" src="assets/images/flags/${currentCurrency.slice(0, -1).toLowerCase()}.webp" alt="${currentCurrency.slice(0, -1)} flag" />
                <span class="converter__currency-name">${currentCurrency}</span>
                <svg class="converter__chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <path fill="#fff" d="M2.988 4.02h6.024c.422 0 .633.515.328.82l-3 3a.48.48 0 0 1-.68 0l-3-3c-.304-.305-.093-.82.328-.82" />
                </svg>
  `;

  currencySelectBtn.innerHTML = "";

  currencySelectBtn.insertAdjacentHTML("afterbegin", btnContent);

  // Change on select

  if (!pickerEl) return;

  pickerEl.addEventListener("click", (e) => {
    setCurrentCurrency(e.target.closest("li").querySelector(".converter__picker-code").textContent);

    const currentCurrency = getCurrentCurrency();

    const btnContent = `
              <img class="converter__flag-btn" src="assets/images/flags/${currentCurrency.slice(0, -1).toLowerCase()}.webp" alt="${currentCurrency.slice(0, -1)} flag" />
                <span class="converter__currency-name">${currentCurrency}</span>
                <svg class="converter__chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <path fill="#fff" d="M2.988 4.02h6.024c.422 0 .633.515.328.82l-3 3a.48.48 0 0 1-.68 0l-3-3c-.304-.305-.093-.82.328-.82" />
                </svg>
  `;

    currencySelectBtn.innerHTML = "";

    // e.target.closest("li").insertAdjacentHTML("beforeend", svg);

    // e.target.closest("li").classList.add("converter__picker-item--selected");

    currencySelectBtn.insertAdjacentHTML("afterbegin", btnContent);
  });
};

// const svg = `
//  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
// <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
//  </svg>`;
