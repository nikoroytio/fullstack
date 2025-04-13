import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (capital) {
      if (!api_key) {
        setError('API key is missing. Please set the environment variable.')
        return
      }
      
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
          setError(null)
        })
        .catch(error => {
          if (error.response?.status === 401) {
            setError('Invalid API key. Please check your OpenWeatherMap API key.')
          } else {
            setError('Error fetching weather data: ' + error.message)
          }
          setWeather(null)
        })
    }
  }, [capital, api_key])

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>
  }

  if (!weather) {
    return <div>Loading weather data...</div>
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img 
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather 