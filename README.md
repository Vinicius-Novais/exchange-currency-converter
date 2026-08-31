# FX Checker

> [Live Demo]([LINK DO DEPLOY])

![FX Checker Screenshot]([LINK DA SCREENSHOT])

---

## Overview

FX Checker is a currency converter and exchange rate tracker built as a [Frontend Mentor](https://www.frontendmentor.io/) intermediate-advanced challenge.

It uses real exchange rate data from the [Frankfurter API v2](https://frankfurter.dev/) to deliver live conversions, historical charts, and multi-currency comparison.

---

## Features

- **Currency Converter** — real-time conversion between 55 currencies with swap, favorite and log conversion
- **History Panel** — OPEN/LAST/CHANGE/% CHANGE cards with an interactive Chart.js line chart and 6 range selectors (1D to 5Y)
- **Compare Panel** — converts the send amount into all 54 other currencies at once
- **Favorites Panel** — pinned currency pairs with live rate and daily variation
- **Log Panel** — conversion history with timestamps and delete functionality
- **Live Ticker** — animated ticker with [NUMBER] currency pairs and daily variation
- **Persistent storage** — favorites and log saved via localStorage

---

## Tech Stack

- HTML5 semantic
- CSS vanilla — BEM, CSS nesting, custom properties, `clamp()`
- JavaScript vanilla — ES Modules, module pattern
- [Chart.js](https://www.chartjs.org/) via CDN
- [Frankfurter API v2](https://frankfurter.dev/)

---

## Architecture

### Module pattern

Each module owns its DOM, logic and state for its feature. No classes — functions with closures for context isolation (e.g. two independent picker instances from one `setupPicker` function).

### State management

A single `state.js` object is the source of truth. The DOM reflects state — never the other way around.

### API design

- `fetchSupportedCurrencies` — filtered to 55 currencies with available flags
- `fetchAllRates(base)` — all rates for the current send currency (converter, compare, ticker)
- `fetchAllRates('EUR')` + `fetchRatesYesterday('EUR')` — fixed EUR base for favorites and history cards (avoids cross-rate imprecision)
- `fetchSeries(base, quote, from)` — time series for chart and OPEN/LAST cards

### Technical decisions

| Decision                                | Reason                                                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| EUR as fixed base for favorites/history | Cross-rate calculation via variable base introduces floating-point imprecision. EUR is the Frankfurter native base (ECB data), more accurate. |
| EOD data                                | Frankfurter publishes ECB reference rates once per day at 16:00 CET. OPEN = last business day rate, LAST = today's rate.                      |
| Favorites variation `< 0.01%`           | When variation rounds to 0.00% but isn't zero, shows `< 0.01%` to avoid misleading the user.                                                  |
| CDN for Chart.js                        | No bundler — vanilla JS project. CDN is the correct approach.                                                                                 |

---

## Running locally

```bash
# Clone the repository
git clone https://github.com/[SEU_USERNAME]/[NOME_DO_REPO].git

# Open with a local server (Live Server extension or similar)
# ⚠️ ES Modules require HTTP — opening index.html directly won't work
```

---

## Author

- Frontend Mentor — [@[SEU_USERNAME]](https://www.frontendmentor.io/profile/[SEU_USERNAME])
- GitHub — [@[SEU_USERNAME]](https://github.com/[SEU_USERNAME])
- LinkedIn — [SEU NOME](https://linkedin.com/in/[SEU_USERNAME])
