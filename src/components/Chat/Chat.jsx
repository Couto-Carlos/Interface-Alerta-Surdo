import React, { useRef, useState, useEffect } from 'react';
import './Chat.css';
import policiaSound from '../../sounds/policia.mp3';
import enchenteSound from '../../sounds/enchente.mp3';
import incendioSound from '../../sounds/incendio.mp3';
import violenciaDomesticaSound from '../../sounds/violenciaDomestica.mp3';
import acidenteSound from '../../sounds/acidente.mp3';

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

export default function Chat({ socket }) {
  const messageRef = useRef();
  const [messageList, setMessageList] = useState([]);
  
  // Mapeia os alertIds para os sons correspondentes
  const soundMap = {
    1: new Audio(policiaSound),
    2: new Audio(incendioSound),
    3: new Audio(acidenteSound),
    4: new Audio(violenciaDomesticaSound),
    5: new Audio(enchenteSound),
  };

  // Mapeia os alertIds para as mensagens correspondentes
  const alertMessages = {
    1: "APP Alerta Surdo\nAtenção situação policial reportado. Por favor direcionar uma equipe policial ao local indicado no mapa.",
    2: "APP Alerta Surdo\nAtenção incêndio reportado. Por favor enviar os bombeiros ao local indicado no mapa.",
    3: "APP Alerta Surdo\nAtenção acidente de transito reportado. Por favor direcionar o serviço de emergência ao local indicado no mapa.",
    4: "APP Alerta Surdo\nAtenção violência doméstica reportada. Por favor direcionar uma equipe policial ao local indicado no mapa.",
    5: "APP Alerta Surdo\nAtenção enchente reportada. Por favor direcionar uma equipe da Defesa Civil ao local indicado no mapa para o auxilio.",
  };

  useEffect(() => {
    socket.on('receive_message', data => {
      setMessageList((current) => [...current, data]);

      // Toca o som de alerta correspondente ao alertId
      const audio = soundMap[data.alertId];
      if (audio) {
        audio.play().catch(error => console.error('Failed to play alert sound:', error));
      }
    });

    return () => socket.off('receive_message');
  }, [socket, soundMap]);

  const handleSubmit = () => {
    const message = messageRef.current.value;
    if (!message.trim()) return;

    getLocationLink((locationLink, error) => {
      if (error) {
        console.error('Failed to get location:', error);
        socket.emit('message', { text: message, location: null });
      } else {
        socket.emit('message', { text: message, location: locationLink });
      }
      clearInput();
    });
  };

  const clearInput = () => {
    messageRef.current.value = '';
  };

  return (
    <div>
      <h1>Mensagem de Alerta</h1>
      <table>
        <thead>
          <tr>
            <th>Autor</th>
            <th>Mensagem</th>
            <th>Localização</th>
          </tr>
        </thead>
        <tbody>
          {messageList.map((message, index) => (
            <tr key={index}>
              <td>{message.author}</td>
              <td>
                {alertMessages[message.alertId] || 'Mensagem de alerta não reconhecida.'}
              </td>
              <td>
                {message.location && (
                  <a href={message.location} target="_blank" rel="noopener noreferrer">
                    Ver no Google Maps
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <input type='text' ref={messageRef} placeholder='Mensagem' />
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
}