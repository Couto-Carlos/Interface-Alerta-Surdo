import React, { useEffect, useState } from 'react';
import policiaSound from '../../sounds/policia.mp3';
import enchenteSound from '../../sounds/enchente.mp3';
import incendioSound from '../../sounds/incendio.mp3';
import violenciaDomesticaSound from '../../sounds/violenciaDomestica.mp3';
import acidenteSound from '../../sounds/acidente.mp3';
import './Chat.css'

export default function Chat({ socket, setSocket }) {
  const [messageList, setMessageList] = useState([]); //Colocar messageList em App, para não perder

  useEffect(() => {
        socket.on('receive_message', data => {
        setMessageList((current) => [...current, data]);
        playAlertSound(data.alertId);
        });
  
    return () => socket.off('receive_message');
  }, [socket]);

  const soundMap = {
    1: new Audio(policiaSound),
    2: new Audio(incendioSound),
    3: new Audio(acidenteSound),
    4: new Audio(violenciaDomesticaSound),
    5: new Audio(enchenteSound),
  };

  const playAlertSound = (alertId) => {
    const audio = soundMap[alertId];
      if (audio) {
        audio.play().catch(error => console.error('Failed to play alert sound:', error));
      }
  };

  const getMessageText = (alertId) => {
    switch (alertId) {
      case 1:
        return 'APP Alerta Surdo\nAtenção situação policial reportado. Por favor direcionar uma equipe policial ao local indicado no mapa.';
      case 2:
        return 'APP Alerta Surdo\nAtenção incêndio reportado. Por favor enviar os bombeiros ao local indicado no mapa.';
      case 3:
        return 'APP Alerta Surdo\nAtenção acidente de trânsito reportado. Por favor direcionar o serviço de emergência ao local indicado no mapa.';
      case 4:
        return 'APP Alerta Surdo\nAtenção violência doméstica reportada. Por favor direcionar uma equipe policial ao local indicado no mapa.';
      case 5:
        return 'APP Alerta Surdo\nAtenção enchente reportada. Por favor direcionar uma equipe da Defesa Civil ao local indicado no mapa para o auxílio.';
      default:
        return 'APP Alerta Surdo\nAlerta genérico.';
    }
  };

  const sendResponse = (authorId) => (event) => {
    socket.emit('alert_response', { confirmation: true, authorId });
    changeText(event);
    setSocket(socket);
  }

  const changeText = (event) => {
    event.target.innerText = 'Direcione-se ao local no mapa\n<--';
  }

  return (
    <div>
      <h1>Mensagem de Alerta</h1>
      <table>
        <thead>
          <tr>
            <th>ID do solicitante</th>
            <th>Mensagem</th>
            <th>Localização</th>
            <th>Responder</th>
          </tr>
        </thead>
        <tbody>
          {messageList.map((message, index) => (
            <tr key={index}>
              <td> {message.authorId}</td>
              <td style={{ whiteSpace: 'pre-line' }}>{getMessageText(message.alertId)}</td>
              <td>
                <a href={message.location} target="_blank" rel="noopener noreferrer">
                  Ver minha localização no Google Maps
                </a>
              </td>
              <td> 
                  <button onClick={sendResponse(message.authorId)}>Responder</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
