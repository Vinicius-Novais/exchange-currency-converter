import { SUPPORTED_CURRENCIES, BASE_URL } from "./constants.js";
import { getLastBusinessDay } from "./utils.js";

export const fetchSupportedCurrencies = async function () {
  const response = await fetch(`${BASE_URL}/currencies`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const currenciesName = (await response.json())
    .filter((currency) => SUPPORTED_CURRENCIES.includes(currency.iso_code))
    .reduce((acc, { iso_code, name }) => {
      acc[iso_code] = name;
      return acc;
    }, {});

  console.log(currenciesName);
  return currenciesName;
};

// fetchSupportedCurrencies();

export const fetchRate = async function (fCurrency, sCurrency) {
  const response = await fetch(`${BASE_URL}/rate/${fCurrency}/${sCurrency}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const rate = await response.json();

  console.log(rate);
  return rate;
};

fetchRate("BRL", "EUR");

export const fetchAllRates = async function (base, date = "") {
  const dateParam = date ? `&date=${date}` : "";

  const response = await fetch(`${BASE_URL}/rates?base=${base}&quotes=${SUPPORTED_CURRENCIES.join(",")}${dateParam}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const allRates = (await response.json())
    .filter((currency) => SUPPORTED_CURRENCIES.includes(currency.quote))
    .reduce((acc, { quote, rate }) => {
      acc[quote] = rate;
      return acc;
    }, {});

  console.log(allRates);
  return allRates;
};

export const fetchRatesYesterday = async function (base) {
  const yesterday = getLastBusinessDay();

  return fetchAllRates(base, yesterday);
};

export const fetchSeries = async function (base, quote, from) {
  const series = await fetch(`${BASE_URL}/rates?from=${from}&base=${base}&quotes=${quote}`);
  if (!series.ok) throw new Error(`HTTP Error! Status: ${series.status}`);

  return await series.json();
};
