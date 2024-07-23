import React, { useRef, useState } from 'react';
import './Join.css';
import io from 'socket.io-client';
import policiaImg from '../../images/policia.jpg'; // Caminho para a imagem de polícia
import enchenteImg from '../../images/enchente.jpg'; // Caminho para a imagem de enchente
import incendioImg from '../../images/incendio.jpg'; // Caminho para a imagem de incêndio
import violenciaDomesticaImg from '../../images/violenciaDomestica.jpg'; // Caminho para a imagem de violência doméstica
import acidenteImg from '../../images/acidente.jpg'; // Caminho para a imagem de acidente


export default function Join({ setChatVisibility, setSocket }) {
  const usernameRef = useRef(null);
  const [alertId, setAlertId] = useState(null);

  const handleSubmit = async () => {
    const username = usernameRef.current.value;
    if (!username.trim() || alertId === null) return;

    const http = 'https://api-alerta-surdo-production.up.railway.app/';
    const socket = await io.connect(http);
    socket.emit('set_username', username);
    socket.emit('set_alertid', alertId);
    setSocket({ socket, alertId });
    setChatVisibility(true);
  };

  return (
    <div>
      <h1>Join</h1>
      <input
        type='text'
        placeholder='Nome de usuário'
        ref={usernameRef}
      />
     <div className="alert-options">
        <button onClick={() => setAlertId(1)}>
          <img src={policiaImg} alt="Polícia" className="alert-button" />
        </button>
        <button onClick={() => setAlertId(2)}>
          <img src={enchenteImg} alt="Enchente" className="alert-button" />
        </button>
        <button onClick={() => setAlertId(3)}>
          <img src={incendioImg} alt="Incêndio" className="alert-button" />
        </button>
        <button onClick={() => setAlertId(4)}>
          <img src={violenciaDomesticaImg} alt="Violência Doméstica" className="alert-button" />
        </button>
        <button onClick={() => setAlertId(5)}>
          <img src={acidenteImg} alt="Acidente" className="alert-button" />
        </button>
      </div>
      <button onClick={handleSubmit}>Entrar</button>
    </div>
  );
}