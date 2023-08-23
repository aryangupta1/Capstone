import Dashboard from './components/dashboard/dashboard'
import './App.css'
import Web3 from 'web3'

declare global {
  interface Window {
    ethereum?: {
      enable(): Promise<string[]>;
      on?: () => void;
      removeListener?: () => void;
    };
    web3?: any;
  }
}

function App() {
  // Check if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    console.log('Web3 detected! Using injected web3 or ethereum.');
    const provider = window['ethereum'] || window.web3.currentProvider
    const web3 = new Web3(provider);
  } else {
    console.log('No web3 detected. Falling back to localhost:7545. You should consider trying MetaMask!');
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
  }
  
  return (
    <div className="App">
      <h1>Decentralized Data Storage</h1>
      <Dashboard />
    </div>
  );
}

export default App
