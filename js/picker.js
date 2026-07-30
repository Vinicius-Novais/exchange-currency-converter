import { SUPPORTED_CURRENCIES, POPULAR_CURRENCIES } from "./constants.js";
import { state } from "./state.js";

//FN
export const setupPicker = function (triggerBtn, pickerEl, getCurrentCurrency, setCurrentCurrency) {
  //Show/hide picker
  triggerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pickerEl.hidden = !pickerEl.hidden;

    pickerEl.querySelector(".converter__picker-input").value = "";

    if (pickerEl.hidden) return;

    pickerEl.querySelector("ul").innerHTML = "";
    renderPickerList(pickerEl, getCurrentCurrency);
  });

  pickerEl.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!e.target.closest("li")) return;
    if (!e.target.closest("li").classList.contains("converter__picker-item")) return;

    console.log(e.target.closest("li"));
    e.target
      .closest("li")
      .parentElement.querySelectorAll("li")
      .forEach((li) => li.classList.remove("converter__picker-item--selected"));

    e.target.closest("li").classList.add("converter__picker-item--selected");

    setCurrentCurrency(e.target.closest("li").querySelector(".converter__picker-code").textContent);

    renderTriggerBtn(triggerBtn, getCurrentCurrency);

    pickerEl.hidden = true;
  });

  document.addEventListener("click", () => {
    pickerEl.hidden = true;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || pickerEl.hidden) return;
    pickerEl.hidden = true;

    pickerEl.querySelector(".converter__picker-input").value = "";
  });
  pickerEl.querySelector(".converter__picker-input").addEventListener("input", (e) => {
    handdleInputSearch(e, pickerEl, getCurrentCurrency);
  });

  renderTriggerBtn(triggerBtn, getCurrentCurrency);
};

//FN
const renderPickerList = function (pickerEl, getCurrentCurrency) {
  const currentCurrency = getCurrentCurrency();

  console.log(currentCurrency);
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
                 <li class="converter__picker-item ${code === currentCurrency ? "converter__picker-item--selected" : ""}">
                    <img class="converter__picker-flag" src="assets/images/flags/${code.slice(0, -1).toLowerCase()}.webp" alt="${code.slice(0, -1)} flag" />
                    <span class="converter__picker-code">${code}</span>
                    <span class="converter__picker-name">${name}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
                     </svg>
                  </li>`;
  });

  pickerEl.querySelector("ul").insertAdjacentHTML("afterbegin", popularCurrenciesHTML);

  //HTML other
  let otherCurrenciesHTML = `
                 <li class="converter__picker-heading">
                    <span>OTHER CURRENCIES</span>
                    <span class="converter__picker-count">${Object.entries(otherCurrencies).length}</span>
                  </li>
                  `;
  Object.entries(otherCurrencies).forEach(([code, name]) => {
    otherCurrenciesHTML += `
                <li class="converter__picker-item ${code === currentCurrency ? "converter__picker-item--selected" : ""}">
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

//FN
export const renderTriggerBtn = function (currencySelectBtn, getCurrentCurrency) {
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
};

//FN

const handdleInputSearch = function (e, pickerEl, getCurrentCurrency) {
  const currentCurrency = getCurrentCurrency();

  const typedtext = e.target.value.toUpperCase();

  if (typedtext === "") {
    pickerEl.querySelector("ul").innerHTML = "";
    renderPickerList(pickerEl, getCurrentCurrency);

    return;
  }

  let li = "";

  Object.entries(state.currencies).forEach(([code, name]) => {
    if (!code.includes(typedtext) && !name.toUpperCase().includes(typedtext)) return;
    console.log(code, typedtext);
    li += `  <li class="converter__picker-item ${code === currentCurrency ? "converter__picker-item--selected" : ""}">
                    <img class="converter__picker-flag" src="assets/images/flags/${code.slice(0, -1).toLowerCase()}.webp" alt="${code.slice(0, -1)} flag" />
                    <span class="converter__picker-code">${code}</span>
                    <span class="converter__picker-name">${name}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="converter__picker-check">
                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8l4 4 8-8" />
                     </svg>

                 </li>`;
  });

  pickerEl.querySelector("ul").innerHTML = "";

  pickerEl.querySelector("ul").insertAdjacentHTML("beforeend", li);
};
