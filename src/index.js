import './css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchField: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchField.addEventListener(
  'input',
  debounce(countrySearch, DEBOUNCE_DELAY)
);

function countrySearch(event) {
  clearInfo();
  const searchedCountry = event.target.value.trim();
  if (searchedCountry === '') {
    return;
  }
  fetchCountries(searchedCountry)
    .then(countriesArray => {
      if (countriesArray.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countriesArray.length <= 10 && countriesArray.length >= 2) {
        return createCountriesMarkup(countriesArray);
      }
      if (countriesArray.length === 1) {
        return createCountryCard(countriesArray);
      }
    })
    .catch(error => {
      refs.countriesList.innerHTML = '';
      return Notify.failure('Oops, there is no country with that name');
    });
}

function createCountriesMarkup(countriesArray) {
  const markup = countriesArray.map(({ flags, name }) => {
    const countryItem = document.createElement('li');
    countryItem.classList.add('country-item');
    const countryFlag = document.createElement('img');
    countryFlag.classList.add('country-flag');
    countryFlag.src = flags.svg;
    countryFlag.alt = 'flag';
    countryFlag.width = '60';
    const countryName = document.createElement('h3');
    countryName.textContent = name;
    countryItem.append(countryFlag, countryName);
    return countryItem;
  });
  refs.countriesList.append(...markup);
}

function createCountryCard(countryArray) {
  const markup = countryArray.map(country => {
    const { flags, name, capital, population, languages } = country;

    const countryItem = document.createElement('div');
    countryItem.classList.add('country-header');
    const countryFlag = document.createElement('img');
    countryFlag.classList.add('country-flag');
    countryFlag.src = flags.svg;
    countryFlag.alt = 'flag';
    countryFlag.width = '60';
    const countryName = document.createElement('h1');
    countryName.textContent = name;

    const capitalTitle = document.createElement('b');
    capitalTitle.textContent = 'Capital: ';
    const countryCapital = document.createElement('p');
    countryCapital.textContent = `${capital}`;
    countryCapital.prepend(capitalTitle);

    const populationTitle = document.createElement('b');
    populationTitle.textContent = 'Population: ';
    const countryPopulation = document.createElement('p');
    countryPopulation.textContent = `${population}`;
    countryPopulation.prepend(populationTitle);

    const languageTitle = document.createElement('b');
    languageTitle.textContent = 'Languages: ';
    const countryLanguage = document.createElement('p');
    countryLanguage.textContent = `${languages
      .map(language => language.name)
      .join(', ')}`;
    countryLanguage.prepend(languageTitle);

    countryItem.append(countryFlag, countryName);

    return refs.countryInfo.append(
      countryItem,
      countryCapital,
      countryPopulation,
      countryLanguage
    );
  });
  refs.countryInfo.append(markup);
}

function clearInfo() {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
