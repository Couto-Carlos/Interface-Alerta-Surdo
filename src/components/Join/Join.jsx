import React, { useRef, useState } from 'react';
import './Join.css';
import io from 'socket.io-client';
import policiaImg from '../../images/policia.jpeg'; // Caminho para a imagem de polícia
import enchenteImg from '../../images/enchente.jpg'; // Caminho para a imagem de enchente
import incendioImg from '../../images/incendio.jpg'; // Caminho para a imagem de incêndio
import violenciaDomesticaImg from '../../images/violenciaDomestica.jpg'; // Caminho para a imagem de violência doméstica
import acidenteImg from '../../images/acidente.jpg'; // Caminho para a imagem de acidente
import ambulanciaIcon from '../../images/ambulancia.png';


export default function Join({  setSocket, setChatVisibility, setAwaitVisibility,setAlertId }) {
  const usernameRef = useRef(null); // Inicializa useRef com null
  const [selectedAlertId, setSelectedAlertId] = useState(null);

  const handleAlertSelection = (alertId) => {
    setSelectedAlertId(alertId);
  };

  const OpenConnection = async () => {
    const http = 'https://api-alerta-surdo-production.up.railway.app/';
    const socket = await io.connect(http);
    setSocket(socket);
    setChatVisibility(true);
  }


  const handleSubmit = async () => {

    const http = 'https://api-alerta-surdo-production.up.railway.app/';
    const socket = await io.connect(http);
    socket.emit('set_alertid', selectedAlertId);
    setAlertId(selectedAlertId);

    getLocationLink((locationLink, error) => {
      if (error) {
        console.error('Failed to get location:', error);
        socket.emit('message', { text: getMessageText(selectedAlertId), location: null, alertId: selectedAlertId });
      } else {
        socket.emit('message', { text: getMessageText(selectedAlertId), location: locationLink, alertId: selectedAlertId });
      }
    });

    setSocket(socket);
    setAwaitVisibility(true);
  };

  const getMessageText = (alertId) => {
    switch (alertId) {
      case 1:
        return 'APP Alerta Surdo: Atenção situação policial reportado. Por favor direcionar uma equipe policial ao local indicado no mapa.';
      case 2:
        return 'APP Alerta Surdo: Atenção incêndio reportado. Por favor enviar os bombeiros ao local indicado no mapa.';
      case 3:
        return 'APP Alerta Surdo: Atenção acidente de trânsito reportado. Por favor direcionar o serviço de emergência ao local indicado no mapa.';
      case 4:
        return 'APP Alerta Surdo: Atenção violência doméstica reportada. Por favor direcionar uma equipe policial ao local indicado no mapa.';
      case 5:
        return 'APP Alerta Surdo: Atenção enchente reportada. Por favor direcionar uma equipe da Defesa Civil ao local indicado no mapa para o auxílio.';
      default:
        return 'APP Alerta Surdo: Alerta genérico.';
    }
  };

  const getLocationLink = (callback) => {
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
  };

  return (
    <div>
      <h1>Alerta Surdo</h1>
      <div className="image-grid">
        <img src={policiaImg} alt="Polícia" onClick={() => handleAlertSelection(1)} />
        <img src={incendioImg} alt="Incêndio" onClick={() => handleAlertSelection(2)} />
        <img src={acidenteImg} alt="Acidente" onClick={() => handleAlertSelection(3)} />
        <img src={violenciaDomesticaImg} alt="Violência Doméstica" onClick={() => handleAlertSelection(4)} />
        <img src={enchenteImg} alt="Enchente" onClick={() => handleAlertSelection(5)} />
      </div>
      {selectedAlertId && (
        <div className="user-input">
          <button onClick={handleSubmit}>Enviar</button>
        </div>
      )}
      <button className="icon-button">
        <img src={ambulanciaIcon} alt="Button Icon" onClick={() => { OpenConnection() }} />
      </button>
    </div>
  );
}