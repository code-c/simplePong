import './App.css';
import Pong from './components/Pong';

function App() {
  return (
    <div>
      <div className="upper">
        <h1>PONG</h1>
      </div>
      <div id="App" className="App gameContainer">
        <Pong /> 
      </div>
    </div>
  );
}

export default App;
