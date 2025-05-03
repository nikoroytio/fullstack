import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    }
    fetchResources()
  }, [baseUrl])

  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource)
      setResources(resources.concat(response.data))
      return response.data
    } catch (error) {
      console.error('Error creating resource:', error)
      throw error
    }
  }

  const service = {
    create
  }

  return [resources, service]
} 