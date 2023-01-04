import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  clearMarkup();
  const searchValue = input.value.trim();
  if (!searchValue) {
    return;
  }
  fetchCountries(searchValue)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        countryListMarkup(countries);
      } else if (countries.length === 1) {
        countryInfoMarkup(countries);
      }
    })
    .catch(data => Notify.failure('Oops, there is no country with that name'));
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function countryListMarkup(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li style="display:flex; align-items:center; gap:20px"><img src="${flags.svg}" width=40 height=40>
            <p style="font-size: 20px;">${name.official}</p></li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}

function countryInfoMarkup(country) {
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<div style="display:flex;align-items:center; gap:20px"><img src="${
        flags.svg
      }" width=40 height=40>
            <h1>${name.official}</h1></div>
            <p><span style="font-weight:bold;">Capital:</span>  ${capital}</p>
            <p><span style="font-weight:bold;">Population:</span>  ${population}</p>
            <p><span style="font-weight:bold;">Languages:</span>  ${Object.values(
              languages
            )}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
