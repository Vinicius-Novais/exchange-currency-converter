import { SUPPORTED_CURRENCIES } from "./constants.js";

const fetchSupportedCurrencies = async function () {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v2/currencies`);

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

const fetchRate = async function (fCurrency, sCurrency) {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v2/rate/${fCurrency}/${sCurrency}`);

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

const fetchAllRates = async function () {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v2/rates?base=USD&quotes=${SUPPORTED_CURRENCIES.join(",")}`);

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

fetchAllRates();

// https://api.frankfurter.dev/v2/rates url para o rate daquele par
