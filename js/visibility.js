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
  badgeCountEl.forEach((badge) => {
    const type = badge.dataset.badgeCount;

    if (type === "favorite") {
      if (state.favorites.length > 0) {
        badge.textContent = state.favorites.length;
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    }
    if (type === "log") {
      if (state.log.length > 0) {
        badge.textContent = state.log.length;
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    }

    if (type === "selected") {
      renderSelectedBadge();
    }

    // console.log(type);
    // console.log(badge);
  });
};

const renderSelectedBadge = function () {
  const badgeSelected = document.querySelector('[data-badge-count="selected"]');
  if (state.activeTab === "favorites") {
    if (state.favorites.length > 0) {
      badgeSelected.textContent = state.favorites.length;
      badgeSelected.hidden = false;
    }
  } else if (state.activeTab === "log") {
    if (state.log.length > 0) {
      badgeSelected.textContent = state.log.length;
      badgeSelected.hidden = false;
    }
  } else {
    badgeSelected.textContent = "";
    badgeSelected.hidden = true;
  }
};
