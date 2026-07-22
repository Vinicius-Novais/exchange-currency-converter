import { SUPPORTED_CURRENCIES, BASE_URL } from "./constants.js";

export const fetchSupportedCurrencies = async function () {
  try {
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
  } catch (err) {
    console.log(err.message);
  }
};

fetchSupportedCurrencies();

export const fetchRate = async function (fCurrency, sCurrency) {
  try {
    const response = await fetch(`${BASE_URL}/rate/${fCurrency}/${sCurrency}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rate = await response.json();

    console.log(rate);
    return rate;
  } catch (err) {
    console.log(err);
  }
};

fetchRate("EUR", "BRL");

export const fetchAllRates = async function (base) {
  try {
    const response = await fetch(`${BASE_URL}/rates?base=${base}&quotes=${SUPPORTED_CURRENCIES.join(",")}`);

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
  } catch (err) {
    console.log(err);
  }
};

fetchAllRates("USD");
