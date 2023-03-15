import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const notificationOptions = {
  position: 'center-top',
  cssAnimationStyle: 'from-top',
  showOnlyTheLastOne: true,
};

searchBoxEl.addEventListener(`input`, debounce(onCountrySearch, DEBOUNCE_DELAY));


function onCountrySearch(e) {
    const searchQuery = e.target.value.trim();
    if (searchQuery === '') {
        resetMarkup();
        return;
    }
    fetchCountries(searchQuery)
    .then(handle404Error)
    .then(onFetch)
    .then(onFetchError)
}

function onFetch(data) {
    if (data.length >= 10) {
        Notify.info(
      'Too many matches found. Please enter a more specific name.',
      notificationOptions
        );
    }
    else if (data.length === 1) {
        showCountryInfo(data);
    }
    else if (data.length > 1 && data.length < 10) {
        showFlag(data);
    }
   
}

function handle404Error(data) {
    if (data.status === 404) {
        throw new Error (data.massage)
    } 
    return data;
}

function onFetchError(error) {
    console.log(error.massage);
    resetMarkup();
    Notify.failure(
    'Oops, there is no country with that name',
    notificationOptions
  );
}


function showFlag(countries) {
  resetMarkup();
  const markup = countries
    .map(
      country =>
        `<li class="country"><img src='${country.flags.svg}' width=30 height=20 alt="${country.flags.alt}"><p class="name">${country.name.common}</p></li>`
    )
    .join('');
  countryListEl.insertAdjacentHTML('afterbegin', markup);
}

function showCountryInfo(country) {
  resetMarkup();
  const languages = [];
  Object.entries(country[0].languages).forEach(([key, value]) => {
    languages.push(value);
  });

  const markup = `<ul class="country-full">
        <li class="country"><img src='${
          country[0].flags.svg
        }' width=30 height=20 alt="${country[0].flags.alt}">
            <p class="name">${country[0].name.common}</p>
        </li>
        <li class="country"><span class="name">Capital:</span> ${
          country[0].capital
        }</li>
        <li class="country"><span class="name">Population:</span> ${
          country[0].population
        }</li>
        <li class="country"><span class="name">Languages:</span> ${languages.join(
          ', '
        )}</li>
    </ul>`;
  countryInfoEl.innerHTML = markup;
}

function resetMarkup() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}