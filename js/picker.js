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

  renderPickerList();

  const svg = `
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
   </svg>`;
};

const renderPickerList = function () {
  const popularCurrencies = `
   <li class="converter__picker-heading">
                    <span>POPULAR</span>
                    <span class="converter__picker-count">${POPULAR_CURRENCIES.length}</span>
                  </li>

                  <li class="converter__picker-item converter__picker-item--selected">
                    <img class="converter__picker-flag" src="assets/images/flags/${POPULAR_CURRENCIES[0].slice(0, -1).toLowerCase()}.webp" alt="${POPULAR_CURRENCIES[0].slice(0, -1)} flag" />
                    <span class="converter__picker-code">${POPULAR_CURRENCIES[0]}</span>
                    <span class="converter__picker-name">${state[POPULAR_CURRENCIES[0]]}</span>
                    
                  </li>

                  <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/${POPULAR_CURRENCIES[1].slice(0, -1).toLowerCase()}.webp" alt="${POPULAR_CURRENCIES[1].slice(0, -1)} flag" />
                    <span class="converter__picker-code">${POPULAR_CURRENCIES[1]}</span>
                    <span class="converter__picker-name">${state[POPULAR_CURRENCIES[1]]}</span>
                  </li>

                  <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/${POPULAR_CURRENCIES[2].slice(0, -1).toLowerCase()}.webp" alt="${POPULAR_CURRENCIES[2].slice(0, -1)} flag" />
                    <span class="converter__picker-code">${POPULAR_CURRENCIES[2]}</span>
                    <span class="converter__picker-name">${state[POPULAR_CURRENCIES[2]]}</span>
                  </li>
                  `;

  let html;
  Object.entries(state.currencies).forEach(([code, name]) => {
    html += `
      <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/${code.slice(0, -1).toLowerCase()}.webp" alt="${code.slice(0, -1)} flag" />
                    <span class="converter__picker-code">${code}</span>
                    <span class="converter__picker-name">${name}</span>
                  </li>
    `;
  });

  console.log(html);

  const otherCurrencies = `
                  <li class="converter__picker-heading">
                    <span>OTHER CURRENCIES</span>
                    <span class="converter__picker-count">${SUPPORTED_CURRENCIES.length - POPULAR_CURRENCIES.length}</span>
                  </li>

                   <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/ae.webp" alt="AE flag" />
                    <span class="converter__picker-code">AED</span>
                    <span class="converter__picker-name">UAE Dirham</span>
                  </li>

                  <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/ar.webp" alt="AR flag" />
                    <span class="converter__picker-code">ARS</span>
                    <span class="converter__picker-name">Argentine Peso</span>
                  </li>

                  <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/au.webp" alt="AU flag" />
                    <span class="converter__picker-code">AUD</span>
                    <span class="converter__picker-name">Australian Dollar</span>
                  </li>
                  
                  `;
};
