import React, {useRef, useState, useEffect} from 'react'

function getLocationLink(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        callback(locationLink);
      },
      (error) => {
        console.error(`ERROR(${error.code}): ${error.message}`);
        callback(null, error);
      }
    );
  } else {
    const error = new Error('Geolocation is not supported by this browser.');
    callback(null, error);
  }
}

export default function Chat({socket}) {


  const messageRef = useRef()
  const [messageList, setMessageList] = useState([])

  useEffect(() =>{
    socket.on('receive_message', data =>{
      setMessageList((current) => [...current, data])
    })

    return() => socket.off('receive_message')
  }, [socket])

  const handleSubmit = () => {
    const message = messageRef.current.value
    if(!message.trim()) return

    getLocationLink((locationLink, error) => {
      if (error) {
        console.error('Failed to get location:', error);
        socket.emit('message', { text: message, location: null });
      } else {
        socket.emit('message', { text: message, location: locationLink });
      }
      clearInput();
    });
  }

  const clearInput = () => {
    messageRef.current.value = ''
  }

  return (
    <div>
        <h1>Chat</h1>
        {
          messageList.map((message, index) => (
            <>
            <div>
              <p key={index}>{message.author}: {message.text}</p>
              <a href={message.location}target="_blank" rel="noopener noreferrer">
                Ver minha localização no Google Maps
              </a>
            </div>
            </>
            
          ))
        }
        <input type='text' ref ={messageRef} placeholder='Mensagem' />
        <button onClick={() =>handleSubmit() }>Enviar</button>
    </div>
  )
}
