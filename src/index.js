import './css/styles.css';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    descr: document.querySelector('.country-info'),
  };

  function renderCountryCard(country) {
    refs.list.classList.add('hide');
    const card = searchedCountryMarkup(country);
    refs.descr.insertAdjacentHTML('beforeend', card);
  }

  function renderCountriesList(countriesArray) {
    refs.list.classList.remove('hide');
    const result = generateCountriesListMukup(countriesArray);
    refs.list.insertAdjacentHTML('beforeend', result);
  }

  function renderMarkup(countriesArray) {
    if (countriesArray.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (countriesArray.length > 2 && countriesArray.length < 10) {
      renderCountriesList(countriesArray);
    } else if (countriesArray.length === 1) {
      renderCountryCard(countriesArray[0]);
    }
  }
  
  function searchedCountryMarkup({
    flags,
    name,
    capital,
    population,
    languages,
  }) {
    return `<p class="main-string"><img src= ${flags.svg} alt=""</span>${
      name.official
    }</p>
  <p><span class="category">Capital:</span> ${capital}</p>
  <p><span class="category">Population:</span> ${population}</p>
  <p><span class="category">Languages:</span> ${Object.values(languages)}</p>`;
  }

  function createCounriesListMarkup({ flags, name }) {
    return `<li class="category"><span><img src= ${flags.svg} alt=""></span>${name.official}</li>`;
  }
  
  function generateCountriesListMukup(countriesArray) {
    return countriesArray.reduce(
      (acc, country) => acc + createCounriesListMarkup(country),
      ''
    );
  }
  
  refs.input.addEventListener(
    'keydown',
    debounce(countryInput, DEBOUNCE_DELAY)
  );
  
  function countryInput(e) {
    clearContent();
    const countryName = e.target.value.trim();
    if (countryName === '') {
      return;
    }
    fetchCountries(countryName)
      .then(r => renderMarkup(r))
      .catch(errorNotify);
  }

  function errorNotify(error) {
    if (error === 'not found') {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
  }
  
  function clearContent() {
    refs.list.innerHTML = '';
    refs.descr.innerHTML = '';
  }