import { state } from "./state.js";
const tabs = document.querySelectorAll(".dashboard__tab");
const panels = document.querySelectorAll("[data-panels]");
const dd = document.querySelector(".dashboard__dd");
const ddUl = document.querySelector(".dashboard__dd-list");
const ddItens = document.querySelectorAll(".dashboard__dd-item");
const badgeCountEl = document.querySelectorAll("[data-badge-count]");
console.log(badgeCountEl[0].dataset.badgeCount);

console.log(panels);
export const setupVisibility = function () {
  //tabs and panels visibility (desktop)
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      state.activeTab = tab.dataset.tab;
      panels.forEach((p) => (p.hidden = true));
      document.querySelector(`.dashboard__panel--${state.activeTab}`).hidden = false;
    });
  });

  //tabs and panels visibility (mobile)
  dd.addEventListener("click", () => {
    ddUl.hidden = !ddUl.hidden;
    renderBadge();
  });

  ddItens.forEach((ddItem) => {
    ddItem.addEventListener("click", () => {
      document.querySelector(".dashboard__place-holder").textContent = ddItem.dataset.tab.toUpperCase();
      state.activeTab = ddItem.dataset.tab;

      panels.forEach((p) => (p.hidden = true));
      document.querySelector(`.dashboard__panel--${ddItem.dataset.tab}`).hidden = false;
    });
  });
};

export const renderBadge = function () {
  const countType = {
    favorites: state.favorites.length,
    log: state.log.length,
  };
  badgeCountEl.forEach((badge) => {
    const type = badge.dataset.badgeCount;
    console.log(type);

    if (type === "selected") {
      renderSelectedBadge();
      return;
    }

    if (countType[type] > 0) {
      console.log("oi");
      badge.textContent = countType[type];
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  });
};

const renderSelectedBadge = function () {
  const countType = {
    favorites: state.favorites.length,
    log: state.log.length,
  };
  const badgeSelected = document.querySelector('[data-badge-count="selected"]');

  if (countType[state.activeTab] > 0) {
    badgeSelected.textContent = countType[state.activeTab];
    badgeSelected.hidden = false;
  } else {
    badgeSelected.hidden = true;
  }
};
