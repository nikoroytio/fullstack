import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [found, setFound] = useState(false)

  useEffect(() => {
    if (name) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then(response => {
          setCountry(response.data)
          setFound(true)
        })
        .catch(error => {
          setCountry(null)
          setFound(false)
        })
    }
  }, [name])

  return { country, found }
} 