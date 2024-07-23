import { useState } from 'react';
import './App.css';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

function App() {
  const [chatVisibility, setChatVisibility] = useState(false);
  const [socketData, setSocketData] = useState({ socket: null, alertId: null });

  return (
    <div className='App'>
      {
        chatVisibility ? 
          <Chat socket={socketData.socket} alertId={socketData.alertId} /> : 
          <Join setSocket={setSocketData} setChatVisibility={setChatVisibility} />
      }
    </div>
  );
}

export default App;
