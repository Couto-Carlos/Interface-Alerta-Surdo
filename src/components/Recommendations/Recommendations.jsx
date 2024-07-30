import React, { useEffect, useState } from 'react';
import policiaImg from '../../images/policia.jpeg'; // Caminho para a imagem de polícia
import enchenteImg from '../../images/enchente.jpg'; // Caminho para a imagem de enchente
import incendioImg from '../../images/incendio.jpg'; // Caminho para a imagem de incêndio
import violenciaDomesticaImg from '../../images/violenciaDomestica.jpg'; // Caminho para a imagem de violência doméstica
import acidenteImg from '../../images/acidente.jpg'; // Caminho para a imagem de acidente
import './Recommendations.css'; // Importe o arquivo CSS

export default function Recommendations({ socket, alertId }) {
  const [response, setResponse] = useState("Aguardando resposta da sede");
  const [isResponded, setIsResponded] = useState(false);

  useEffect(() => {
    socket.on('receive_response', data => {
      if (data.confirmation === true && data.authorId === socket.id) {
        setResponse("Os agentes estão indo ao local");
        setIsResponded(true);
      }
    });
    return () => socket.off('receive_response');
  }, [socket]);

  const getMessageText = (alertId) => {
    switch (alertId) {
      case 1:
        return 'Em caso de situação policial, mantenha a calma e evite confrontos. Espere pela chegada da polícia.';
      case 2:
        return 'Em caso de incêndio, tente sair do local com segurança e evite inalar fumaça. Espere pelos bombeiros.';
      case 3:
        return 'Em caso de acidente de trânsito, se possível, sinalize o local para evitar novos acidentes. Aguarde o serviço de emergência.';
      case 4:
        return 'Em caso de violência doméstica, procure um lugar seguro e espere pela chegada da polícia.';
      case 5:
        return 'Em caso de enchente, evite áreas alagadas e mova-se para um local elevado. Espere pela Defesa Civil.';
      default:
        return 'Aguarde por instruções adicionais.';
    }
  };

  const getImageSrc = (alertId) => {
    switch (alertId) {
      case 1:
        return policiaImg;
      case 2:
        return incendioImg;
      case 3:
        return acidenteImg;
      case 4:
        return violenciaDomesticaImg;
      case 5:
        return enchenteImg;
      default:
        return policiaImg;
    }
  };

  return (
    <div className="recommendations-container">
      <div className={`response-box ${isResponded ? 'responded' : ''}`}>
        <h2>{response}</h2>
      </div>
      <div className="spacer">
        <img src={getImageSrc(alertId)} alt="Alert" className="alert-image" />
      </div>
      <div className="message-box">
        <h2>{getMessageText(alertId)}</h2>
      </div>
    </div>
  );
}

