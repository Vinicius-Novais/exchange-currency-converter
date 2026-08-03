const tabs = document.querySelectorAll(".dashboard__tab");
const panels = document.querySelectorAll("[data-tab]");
const dd = document.querySelector(".dashboard__dd");
const ddUl = document.querySelector(".dashboard__dd-list");
const ddItens = document.querySelectorAll(".dashboard__dd-item");

console.log(dd);
console.log(panels);
export const setupVisibility = function () {
  //tabs and panels visibility (desktop)
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");

      panels.forEach((p) => (p.hidden = true));
      document.querySelector(`.dashboard__panel--${tab.textContent.toLowerCase().split(" ")[0]}`).hidden = false;
    });
  });

  //tabs and panels visibility (mobile)

  dd.addEventListener("click", () => {
    ddUl.hidden = !ddUl.hidden;
  });

  ddItens.forEach((dditem) => {
    dditem.addEventListener("click", () => {
      document.querySelector(".dashboard__place-holder").textContent = dditem.textContent.split(" ")[0];
    });
  });

  //   ddUl.addEventListener("click", () => {
  //     if (ddUl.hidden === "false") return;
  //   });
};
