import { state } from "./state.js";
import { renderBadge } from "./visibility.js";
import { renderEmptyState, hideEmptyState, saveLocalStorageState } from "./utils.js";

const clearAll = document.querySelector(".dashboard__log-clear-btn");
const listContainer = document.querySelector(".dashboard__log-list");
const loggedCount = document.querySelector(".dashboard__log-count");
const logTabButton = document.querySelector(".dashboard__log-btn");
const logDDButton = document.querySelector('[data-tab="log"]');

export const setupLogPanel = function () {
  clearAll.addEventListener("click", () => {
    listContainer.innerHTML = "";
    state.log.length = [];
    renderBadge();
    renderLogPanel();
    loggedCount.textContent = `${state.log.length} LOGGED`;
  });

  logTabButton.addEventListener("click", () => {
    renderLogPanel();
  });
  logDDButton.addEventListener("click", () => {
    if (state.activeTab !== "log") return;

    renderLogPanel();
  });

  listContainer.addEventListener("click", (e) => {
    deleteLog(e);
  });
};

export const renderLogPanel = function () {
  if (state.log.length === 0) {
    renderEmptyState("log");
    return;
  }

  hideEmptyState("log");

  let li = "";

  listContainer.innerHTML = "";
  state.log.forEach((log) => {
    li += `
    <li class="dashboard__log-item dashboard__item" id="${log.id}">
                <div class="dashboard__log-left">
                  <span class="dashboard__log-time">${getDate(log.timeStamp)}</span>
                  <div class="dashboard__log-pair">
                    <span class="dashboard__log-pair-from">${log.send.code}</span>
                    <svg class="dashboard__log-arrow" xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 11 11">
                      <path fill="currentColor" d="M5.11.088c.093-.117.28-.117.398 0l4.898 4.898a.27.27 0 0 1 0 .399l-4.898 4.898c-.117.117-.305.117-.399 0l-.468-.445c-.118-.117-.118-.305 0-.399l3.632-3.656H.281A.27.27 0 0 1 0 5.502v-.656c0-.14.117-.282.281-.282h7.992L4.641.932c-.118-.094-.118-.282 0-.399z" />
                    </svg>
                    <span class="dashboard__log-pair-to">${log.receive.code}</span>
                  </div>
                </div>
                <div class="dashboard__log-right">
                  <div class="dashboard__log-receive">
                    <span class="dashboard__log-send-amount">${new Intl.NumberFormat(navigator.language, {
                      maximumFractionDigits: 2,
                    }).format(log.send.amount)}</span>
                    <span class="dashboard__log-receive-amount">${log.receive.amount}</span>
                  </div>
                  <button class="dashboard__log-delete-btn">
                    <svg class="dashboard__log-delete-icon dashboard__log-delete-icon--outline" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        fill="currentColor"
                        d="M12.875 3.875c.188 0 .375.188.375.375v.375c0 .21-.187.375-.375.375H12.5l-.516 7.945c-.023.586-.539 1.055-1.125 1.055H5.117c-.586 0-1.101-.469-1.125-1.055L3.5 5h-.375a.37.37 0 0 1-.375-.375V4.25c0-.187.164-.375.375-.375h1.922l.797-1.312c.187-.305.61-.563.96-.563h2.368c.351 0 .773.258.96.563l.798 1.312zm-6.07-.75-.446.75h3.258l-.445-.75zm4.054 9.75L11.352 5H4.625l.492 7.875z"
                      />
                    </svg>
                    <svg class="dashboard__log-delete-icon dashboard__log-delete-icon--filled" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path fill="currentColor" d="M12.875 2.75c.188 0 .375.188.375.375v.75c0 .21-.187.375-.375.375h-9.75a.37.37 0 0 1-.375-.375v-.75c0-.187.164-.375.375-.375h2.813l.21-.422c.07-.187.305-.328.493-.328h2.695c.187 0 .398.14.492.328l.235.422zM3.992 12.945 3.5 5h9l-.516 7.945c-.023.586-.539 1.055-1.125 1.055H5.117c-.586 0-1.101-.469-1.125-1.055" />
                    </svg>
                  </button>
                </div>
              </li>
    
    `;
  });
  loggedCount.textContent = `${state.log.length} LOGGED`;
  listContainer.insertAdjacentHTML("beforeend", li);
};

const getDate = function (timeStamp) {
  const month = new Date(timeStamp).toLocaleString("en-US", { month: "short" });

  const day = new Date(timeStamp).getDate();

  const minutesPassed = calcMinutesPassed(timeStamp);

  if (minutesPassed < 60) {
    return `${minutesPassed}M`;
  }

  if (minutesPassed < 1440) return `${Math.floor(minutesPassed / 60)}H`;

  return `${day} ${month}`;
};

const calcMinutesPassed = (timeStamp) => Math.round((new Date() - new Date(timeStamp)) / 1000 / 60);

const deleteLog = function (e) {
  const btn = e.target.closest("button");

  if (!btn) return;

  const index = state.log.findIndex((log) => log.id === btn.closest("li").id);

  if (index === -1) return;

  state.log.splice(index, 1);
  saveLocalStorageState("log", state.log);

  renderLogPanel();
  renderBadge();
};
