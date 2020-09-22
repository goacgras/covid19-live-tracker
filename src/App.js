import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core'

import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import { sortData } from './util/util';

import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, []);

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
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        })
    }

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);

        //get all data from every country
        setCountryInfo(data);
      })
  };

  console.log(countryInfo);

  return (
    // BEM naming convention
    <div className="app">
      <div className="app__left">
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
          <InfoBox
            title="Coronavirus cases"
            total={countryInfo.todayCases}
            cases={countryInfo.cases} />

          <InfoBox
            title="Recovered"
            total={countryInfo.todatRecovered}
            cases={countryInfo.recovered} />

          <InfoBox
            title="Deaths"
            total={countryInfo.todayDeath}
            cases={countryInfo.deaths} />
        </div>

        {/* map */}
        <Map />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* table */}
          <h3>Live cases by country</h3>
          <Table countries={tableData} />

          {/* graph */}
          <h3>World wide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
