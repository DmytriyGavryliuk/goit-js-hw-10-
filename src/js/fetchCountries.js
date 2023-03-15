export function fetchCountries(e) {
    return fetch(
        `https://restcountries.com/v3.1/name/${e}?fields=name,capital,population,flags,languages`
    )
        .then(res => {
            return res.json();
        })
        .then(data => {
            return data;
        });
}