import React, { useRef } from 'react';
import io from 'socket.io-client'

export default function Join({ setChatVisibility, setSocket }) {
  const usernameRef = useRef(null); // Inicializa useRef com null

  const handleSubmit = async () => {
    const username = usernameRef.current.value
    if (!username.trim()) return; // Verifica se o nome de usuário não está vazio

    const http = 'https://api-alerta-surdo-production.up.railway.app/'
    const socket = await io.connect(http)
    socket.emit('set_username', username)
    setSocket(socket)
    setChatVisibility(true)
  }

  return (
    <div>
      <h1>Join</h1>
      <input
        type='text'
        placeholder='Nome de usuário'
        ref={usernameRef} // Associa o input ao useRef
      />
      <button onClick={handleSubmit}>Entrar</button>
    </div>
  )
}
