import React, { useEffect, useState } from 'react';

export default function Recommendations({ socket ,alertId}) {
    const [response,setResponse] = useState("Aguardando resposta da sede");


  useEffect(() => {
        socket.on('receive_response', data => {
            if(data.confirmation == true && data.authorId == socket.id){
                setResponse("Os agentes estão indo ao local");
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
        return 'm caso de enchente, evite áreas alagadas e mova-se para um local elevado. Espere pela Defesa Civil.';
      default:
        return 'Aguarde por instruções adicionais.';
    }
  };

  return (
    <div>
      <h1>Recomendações</h1>

      <h2>{getMessageText(alertId)}</h2>
      <h3>{response}</h3>
      <h3>{socket.id}</h3>
    </div>
  );
}
