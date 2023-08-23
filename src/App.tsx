import Dashboard from './components/dashboard/dashboard'
import './App.css'
import Web3 from 'web3'
import { useState } from 'react'

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

  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);

  if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    console.log('Web3 detected! Using injected web3 or ethereum.')
    const provider = window['ethereum'] || window.web3.currentProvider
    const web3 = new Web3(provider)
    setWeb3Instance(web3)
  } else {
    console.log('No web3 detected. Falling back to localhost:7545. You should consider trying MetaMask!')
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
    setWeb3Instance(web3)
  }
  
  return (
    <div className="App">
      <h1>Decentralized Data Storage</h1>
      <Dashboard web3={web3Instance} />
    </div>
  );
}

export default App
