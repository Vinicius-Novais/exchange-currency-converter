import { SUPPORTED_CURRENCIES, POPULAR_CURRENCIES } from "./constants.js";
import { state } from "./state.js";

export const setupPicker = function (triggerBtn, pickerEl, currencies, onSelect, getState) {
  //Show/hide picker
  triggerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pickerEl.hidden = !pickerEl.hidden;
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

  //Check

  //populate data into picker

  // renderPickerList(pickerEl);

  const svg = `
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
   </svg>`;
};

const renderPickerList = function (pickerEl) {
  const popularCurrencies = Object.fromEntries(POPULAR_CURRENCIES.map((code) => [code, state.currencies[code]]));

  const otherCurrencies = Object.fromEntries(Object.entries(state.currencies).filter(([code]) => !POPULAR_CURRENCIES.includes(code)));

  console.log(popularCurrencies);
  console.log(otherCurrencies);

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
                  </li>
    `;
  });

  pickerEl.querySelector("ul").insertAdjacentHTML("beforeend", otherCurrenciesHTML);
};
