import { SUPPORTED_CURRENCIES, POPULAR_CURRENCIES } from "./constants.js";

export const setupPicker = function (triggerBtn, pickerEl, currencies, onSelect) {
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

  //populate data into picker

  console.log(triggerBtn);

  const popularCurrencies = `
   <li class="converter__picker-heading">
                    <span>POPULAR</span>
                    <span class="converter__picker-count">${POPULAR_CURRENCIES.length}</span>
                  </li>

                  <li class="converter__picker-item converter__picker-item--selected">
                    <img class="converter__picker-flag" src="assets/images/flags/us.webp" alt="US flag" />
                    <span class="converter__picker-code">USD</span>
                    <span class="converter__picker-name">US Dollar</span>
                    
                  </li>

                  <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/eu.webp" alt="EU flag" />
                    <span class="converter__picker-code">EUR</span>
                    <span class="converter__picker-name">Euro</span>
                  </li>

                  <li class="converter__picker-item">
                    <img class="converter__picker-flag" src="assets/images/flags/gb.webp" alt="GB flag" />
                    <span class="converter__picker-code">GBP</span>
                    <span class="converter__picker-name">British Pound</span>
                  </li>
                  `;

  const otherCurrencies = `
                  <li class="converter__picker-heading">
                    <span>OTHER CURRENCIES</span>
                    <span class="converter__picker-count">${SUPPORTED_CURRENCIES.length - POPULAR_CURRENCIES.length}</span>
                  </li>
                  
                  `;

  const svg = `
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
   </svg>`;
};
