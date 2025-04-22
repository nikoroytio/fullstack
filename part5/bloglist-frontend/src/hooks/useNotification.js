import { useState } from 'react'

const useNotification = () => {
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const showNotification = (message, type = 'success') => {
    setNotificationType(type)
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return {
    notification,
    notificationType,
    showNotification
  }
}

export default useNotification