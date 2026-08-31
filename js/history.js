import { state } from "./state.js";
import { fetchSeries } from "./api.js";
import { getDailyVariation, getLastBusinessDay, formatRate, hideEmptyState, renderEmptyState } from "./utils.js";

const historyTabButton = document.querySelector(".dashboard__history-btn");
const historyDDButton = document.querySelector("[data-tab='history']");
const openCardEl = document.querySelector(".dashboard__open-card .dashboard__value-card");
const lastCardEl = document.querySelector(".dashboard__last-card .dashboard__value-card");
const changeCardEl = document.querySelector(".dashboard__change-card .dashboard__value-card");
const percentageCardEl = document.querySelector(".dashboard__percentage-card .dashboard__value-card");
const chartPair = document.querySelector(".dashboard__chart-pair");
const chartCurrentValue = document.querySelector(".dashboard__chart-current-value");
const chartDate = document.querySelector(".dashboard__chart-date");
const chartCanvas = document.querySelector(".dashboard__chart-canvas");
const rangeSelectorBtns = document.querySelectorAll("[data-range]");
let chart;
let currentRangeData = null;
const gradientPlugin = {
  id: "customGradient",
  afterLayout: function (chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(206, 247, 57, 1)");
    gradient.addColorStop(0.6, "rgba(206, 247, 57, 0.3)");
    gradient.addColorStop(1, "rgba(206, 247, 57, 0)");
    chart.data.datasets[0].backgroundColor = gradient;
  },
};
const crosshairPlugin = {
  id: "crosshair",
  afterDraw: function (chart) {
    if (!chart.tooltip || !chart.tooltip._active || !chart.tooltip._active.length) return;

    const ctx = chart.ctx;
    const activePoint = chart.tooltip._active[0];
    const x = activePoint.element.x;
    const topY = chart.chartArea.top;
    const bottomY = chart.chartArea.bottom;
    const y = activePoint.element.y;

    ctx.save();

    // linha vertical tracejada
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.stroke();

    // ponto de intersecção
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#cef739";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // linha horizontal tracejada
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.moveTo(chart.chartArea.left, y);
    ctx.lineTo(chart.chartArea.right, y);
    ctx.stroke();

    ctx.restore();
  },
};
const fractionDigits = {
  "1D": 4,
  "1W": 3,
  "1M": 2,
  "3M": 2,
  "1Y": 2,
  "5Y": 2,
};

export const setupHistory = function () {
  setupCards();

  setupChartHeader();

  selectRange("1M").then((rangeData) => {
    state.rangeData = rangeData;
    setupChart();
  });

  rangeSelectorBtns.forEach((rangeSelectorBtn) => {
    rangeSelectorBtn.addEventListener("click", async (e) => {
      const rangeData = await selectRange(rangeSelectorBtn.dataset.range);
      state.rangeData = rangeData;

      rangeSelectorBtns.forEach((btn) => btn.setAttribute("aria-selected", "false"));
      rangeSelectorBtn.setAttribute("aria-selected", "true");

      setupChart();
    });
  });

  chartCanvas.addEventListener("mouseleave", () => {
    if (!currentRangeData) return;
    chartCurrentValue.textContent = formatRate(currentRangeData.rates[currentRangeData.rates.length - 1]);
    chartDate.textContent = formatHeaderDate(currentRangeData.rawDates[currentRangeData.rawDates.length - 1], state.range);
  });

  historyTabButton.addEventListener("click", () => {
    hideEmptyState("history");
  });

  historyDDButton.addEventListener("click", () => {
    hideEmptyState("history");
  });
};

export const setupCards = async function () {
  try {
    const daysArr = await fetchSeries(state.sendCurrency, state.receiveCurrency, getLastBusinessDay());

    const openRate = daysArr[0].rate;
    const lastRate = daysArr[daysArr.length - 1].rate;

    const dayliVariation = getDailyVariation(lastRate, openRate);

    openCardEl.textContent = openRate;
    lastCardEl.textContent = lastRate;
    const change = lastRate - openRate;
    changeCardEl.textContent = Math.abs(change) < 0.00005 ? "0.0000" : formatRate(change);

    percentageCardEl.textContent = dayliVariation;

    const variation = parseFloat(dayliVariation) > 0 ? "positive" : parseFloat(dayliVariation) < 0 ? "negative" : "";

    percentageCardEl.classList.remove("dashboard__value--positive", "dashboard__value--negative");
    changeCardEl.classList.remove("dashboard__value--positive", "dashboard__value--negative");
    if (!variation) return;

    percentageCardEl.classList.add(`dashboard__value--${variation}`);
    changeCardEl.classList.add(`dashboard__value--${variation}`);
  } catch (err) {
    console.log(err);
    renderEmptyState("history");
  }
};

// Chart
export const setupChartHeader = function () {
  const currentPair = `${state.sendCurrency}/${state.receiveCurrency}`;
  const today = new Date();

  chartPair.textContent = currentPair;
  chartCurrentValue.textContent = state.rates[state.receiveCurrency];
  chartDate.textContent = `${today.toLocaleDateString("en-US", { month: "short" }).toUpperCase()} ${today.toLocaleDateString("en-US", { day: "2-digit" })} 16:00 CET`;
};

export const setupChart = function () {
  if (chart) {
    chart.destroy();
  }

  currentRangeData = state.rangeData;

  chart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: state.rangeData.dates,
      datasets: [
        {
          data: state.rangeData.rates,
          borderWidth: 1,
          pointRadius: 0,
          pointHitRadius: 10,
          borderColor: "#cef739",
          fill: true,
        },
      ],
    },
    options: {
      interaction: {
        mode: "index",
        intersect: false,
      },
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        x: {
          ticks: {
            color: " hsla(0, 0%, 78%, 0.75)",
            maxRotation: 0,
            minRotation: 0,
            includeBounds: true,
            autoSkip: state.range === "5Y" ? false : true,
            maxTicksLimit: state.range === "5Y" ? undefined : window.innerWidth < 768 ? 4.1 : 7.1,
            callback: function (value, index) {
              const date = new Date(state.rangeData.rawDates[index]);

              if (state.range === "5Y") {
                const year = date.getFullYear();
                const prevYear = index > 0 ? new Date(state.rangeData.rawDates[index - 1]).getFullYear() : null;

                if (index === 0 || year === prevYear) return null;

                return String(year);
              }
              if (state.range === "1Y") {
                return date.toLocaleString("en-US", { month: "short" });
              }

              return date.toLocaleString("en-US", { month: "short", day: "numeric" });
            },
          },
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.09)",
            lineWidth: 1,
          },
          border: {
            display: false,
            dash: [5, 5],
          },
          afterBuildTicks(axis) {
            const min = axis.min;
            const max = axis.max;
            const mid = (min + max) / 2;
            axis.ticks = [{ value: max }, { value: mid }, { value: min }];
          },
          ticks: {
            color: " hsla(0, 0%, 78%, 0.75)",
            callback(value) {
              const digits = fractionDigits[state.range] ?? 2;
              return value.toFixed(digits);
            },
          },
        },
      },
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          opacity: 0,
          external: function (context) {
            const { tooltip } = context;

            if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
              const dataPoint = tooltip.dataPoints[0];
              const rate = dataPoint.raw;
              const date = state.rangeData.rawDates[dataPoint.dataIndex];

              chartCurrentValue.textContent = formatRate(rate);
              chartDate.textContent = formatHeaderDate(date, state.range);
            }
          },
        },
      },
    },
    plugins: [gradientPlugin, crosshairPlugin],
  });
};

export const selectRange = async function (range) {
  state.range = range;
  const to = new Date();
  const from = new Date();

  to.setHours(0, 0, 0, 0);

  switch (range) {
    case "1D":
      from.setDate(to.getDate() - 1);
      break;
    case "1W":
      from.setDate(to.getDate() - 7);
      break;
    case "1M":
      from.setMonth(to.getMonth() - 1);
      break;
    case "3M":
      from.setMonth(to.getMonth() - 3);
      break;
    case "1Y":
      from.setFullYear(to.getFullYear() - 1);
      break;
    case "5Y":
      from.setFullYear(to.getFullYear() - 5);
      break;
    default:
      from.setFullYear(to.getFullYear() - 5);
  }

  from.setHours(0, 0, 0, 0);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const rangeArr = await fetchSeries(state.sendCurrency, state.receiveCurrency, formatDate(from));
  const dates = rangeArr.map((rangeData) => {
    const date = new Date(rangeData.date);

    return date.toLocaleString("en-US", { month: "short", day: "numeric" });
  });
  const rates = rangeArr.map((rangeData) => rangeData.rate);
  const rawDates = rangeArr.map((item) => item.date);

  return {
    dates,
    rates,
    rawDates,
  };
};

const formatHeaderDate = function (dateStr, range) {
  const date = new Date(dateStr);
  if (range === "5Y" || range === "1Y") {
    return date.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase() + " 16:00 CET";
  }
  return date.toLocaleString("en-US", { month: "short", day: "numeric" }).toUpperCase() + " 16:00 CET";
};
