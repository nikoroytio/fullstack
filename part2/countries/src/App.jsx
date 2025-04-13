import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    if (searchTerm) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const filteredCountries = response.data.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
          )
          setCountries(filteredCountries)
          setSelectedCountry(null)
        })
    } else {
      setCountries([])
      setSelectedCountry(null)
    }
  }, [searchTerm])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  if (countries.length > 10) {
    return (
      <div>
        <div>
          find countries <input value={searchTerm} onChange={handleSearchChange} />
        </div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <div>
          find countries <input value={searchTerm} onChange={handleSearchChange} />
        </div>
        <Country country={country} />
      </div>
    )
  }

  return (
    <div>
      <div>
        find countries <input value={searchTerm} onChange={handleSearchChange} />
      </div>
      {countries.map(country => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => showCountry(country)}>show</button>
        </div>
      ))}
      {selectedCountry && <Country country={selectedCountry} />}
    </div>
  )
}

export default App
