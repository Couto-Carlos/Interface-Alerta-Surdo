import { useState } from 'react';
import './App.css';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Recommendations from './components/Recommendations/Recommendations';

function App() {
  const [chatVisibility, setChatVisibility] = useState(false);
  const [awaitVisibility, setAwaitVisibility] = useState(false);
  const [alertId, setAlertId] = useState(null);
  const [socket, setSocket] = useState(null);

  return (
    <div className='App'>
      {chatVisibility ? <Chat socket={socket} setSocket={setSocket}/> :
       awaitVisibility ? <Recommendations socket={socket} alertId={alertId}/> :
       <Join setSocket={setSocket} setChatVisibility={setChatVisibility} setAwaitVisibility={setAwaitVisibility} setAlertId={setAlertId}/>}

    </div>
  );
}

export default App;