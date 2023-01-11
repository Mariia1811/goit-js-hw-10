import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const userCountry = e.target.value.trim();

  if (!userCountry) {
    clearsMarkup();
    return;
  }

  fetchCountries(userCountry)
    .then(country => {
      if (country.length > 10) {
        clearsMarkup();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (country.length === 1) {
        clearsMarkup();
        createDivInfoMarkup(country);
      } else if (2 < country.length < 10) {
        clearsMarkup();
        createListMarkup(country);
      }
    })
    .catch(error => {
      clearsMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function clearsMarkup() {
  refs.listEl.innerHTML = '';
  refs.divEl.innerHTML = '';
}

function createListMarkup(country) {
  const markupElList = country
    .map(elem => {
      return `<li class="country"><img src="${elem.flags.svg}" alt="${elem.name.common}" width="30" height="20" class="news-image"><span>${elem.name.common}</span></li>
     `;
    })
    .join('');

  refs.listEl.innerHTML = markupElList;
}

function createDivInfoMarkup(country) {
  const markupDiv = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<ul>
      <img src="${
        flags.svg
      }" alt="${name}" width="40" height="30" class="news-image">
      <h2>${name.common}</h2>
         <li><span>Capital:</span> ${capital}</li>
         <li><span>Population:</span>  ${population}</li>
         <li><span>Languages:</span>  ${Object.values(languages)}</li>
         </ul>
        `;
    })
    .join('');

  refs.divEl.innerHTML = markupDiv;
}
