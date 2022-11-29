export default function fetchCountries(countryName) {
  const baseUrl = `https://restcountries.com/v2/name/${countryName}`;
  const filterParam = `?fields=name,capital,population,flags,languages`;
  const url = baseUrl + filterParam;

  return fetch(url).then(response => {
    if (!response.ok) {
      clearInfo();
      throw new Error(response.status);
    }

    return response.json();
  });
}
