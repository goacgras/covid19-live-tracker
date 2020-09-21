import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core'
import InfoBox from './components/InfoBox';

import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          })
          );
          setCountries(countries);
        })
    }

    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  };

  return (
    // BEM naming convention
    <div className="app">

      {/* Header */}
      {/* title + select input dropdown field */}
      <div className="app__header">
        <h1>COVID-19 LIVE TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country} >

            {/* loop through all the countries and put in dropdown */}
            <MenuItem key={country} value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country => (
                <MenuItem key={country.name} value={country.value}>
                  {country.name}
                </MenuItem>
              ))
            }

          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        {/* info box */}
        <InfoBox title="Coronavirus cases" total={2000} cases={23123} />

        <InfoBox title="Recovered" total={3000} cases={23123} />

        <InfoBox title="Deaths" total={2322} cases={23123} />
      </div>



      {/* table */}
      {/* graph */}

      {/* map */}

    </div>
  );
}

export default App;
