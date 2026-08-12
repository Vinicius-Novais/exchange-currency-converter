import { state } from "./state.js";
import { renderBadge } from "./visibility.js";
const favoritesTabButton = document.querySelector(".dashboard__favorites-btn");
const favoritesDDButton = document.querySelector("[data-tab='favorites']");
const favoritesUl = document.querySelector(".dashboard__favorites-list");
const favoritesCount = document.querySelector(".dashboard__favorites-count");
const favConverterBtn = document.querySelector(".converter__fav-btn");

export const setupFavorites = function () {
  favoritesTabButton.addEventListener("click", (e) => {
    renderFavoritePanel();
  });
  favoritesDDButton.addEventListener("click", (e) => {
    renderFavoritePanel();
  });

  favoritesUl.addEventListener("click", (e) => {
    removeFavorite(e);
  });
};

export const renderFavoritePanel = function () {
  favoritesCount.textContent = `${state.favorites.length} FAVORITES`;
  let li = "";
  state.favorites.forEach((pair) => {
    const baseCurrency = pair.split("/")[0];
    const quoteCurrency = pair.split("/")[1];
    const rate = baseCurrency === state.sendCurrency ? state.rates[quoteCurrency] : state.rates[quoteCurrency] / state.rates[baseCurrency];

    li += `
        <li class="dashboard__favorites-item dashboard__item">
                <span class="dashboard__favorites-pair"
                  >${baseCurrency}
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 11 11">
                    <path fill="#9d9d9d" d="M5.11.088c.093-.117.28-.117.398 0l4.898 4.898a.27.27 0 0 1 0 .399l-4.898 4.898c-.117.117-.305.117-.399 0l-.468-.445c-.118-.117-.118-.305 0-.399l3.632-3.656H.281A.27.27 0 0 1 0 5.502v-.656c0-.14.117-.282.281-.282h7.992L4.641.932c-.118-.094-.118-.282 0-.399z" />
                  </svg>
                  ${quoteCurrency}</span
                >
                <div class="dashboard__favorites-data">
                  <span class="dashboard__favorites-rate">${rate}</span>
                  <span class="dashboard__favorites-change dashboard__value--positive">+0.16%</span>
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

  const pair = `${li.querySelector(".dashboard__favorites-pair").firstChild.textContent.trim()}/${li.querySelector(".dashboard__favorites-pair").lastChild.textContent.trim()}`;

  console.log(pair);

  state.favorites.splice(state.favorites.indexOf(pair), 1);

  favConverterBtn.setAttribute("aria-pressed", "false");

  renderFavoritePanel();
  renderBadge();

  console.log(state);
};
