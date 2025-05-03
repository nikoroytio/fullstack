import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => {
    console.log('Current state:', state)
    return state.notification
  })
  console.log('Notification value:', notification)
  
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: notification ? '' : 'none'
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification 