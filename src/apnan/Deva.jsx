import React, { useState, useEffect } from 'react';
import './index.css';
import { BsFillBrightnessHighFill } from "react-icons/bs";
import { AiOutlineEllipsis } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai";

import { useMoralis } from "react-moralis";

const serverUrl = "https://1pf18efvmoil.usemoralis.com:2053/server"; //Server url from moralis.io
const appId = "Dd51OOJJLmU2FhBBYZsXpuhdG656X3zlFAJruFyY"; // Application id from moralis.io



const Header = (props) => {

  const { Moralis } = useMoralis();
  const { authenticate, isAuthenticated, user } = useMoralis();

  const [chain, setChain] = useState('eth')

  //console.log(JSON.stringify(chain))

  global.variable = chain;
  //console.log(JSON.stringify(chain));

  

const popup = async() => {
  document.getElementById('popup').classList.add('active');

  await Moralis.initialize(appId);
  Moralis.serverURL = serverUrl;
  await Moralis.enableWeb3();
  let currentUser = Moralis.User.current();
  await Auth();
  await Moralis.enableWeb3();
  
}

const Auth = async() => {
  try {
    console.log(`${user.get("username")}`)
    let currentUser = Moralis.User.current();
    let address = Moralis.User.current().get("ethAddress");
    window.alert('Your Wallet Address : ' +address)
    if (!currentUser) {
      currentUser = await Moralis.authenticate();
    }
    
  } catch (error) {
    console.log(error);
  }
}



const popclose = () => {
  document.getElementById('popup').classList.remove('active');
}

const chain_popup = () => {
  document.getElementById('chain_popup').classList.add('active');
}

const chain_popclose = () => {
  document.getElementById('chain_popup').classList.remove('active');
}

const swapdis = () => {
  document.getElementById('dummy').classList.add('active');
  document.getElementById('second_page').classList.add('active');
}
const swapactive = () => {
  document.getElementById('dummy').classList.remove('active');
  document.getElementById('second_page').classList.remove('active');
}
const navicon = () => {
  document.getElementById('navicon').classList.add('active');
  document.getElementById('naviconone').classList.add('active');
  document.getElementById('naviconclose').classList.add('active');
}
const naviconclose = () => {
  document.getElementById('navicon').classList.remove('active');
  document.getElementById('naviconone').classList.remove('active');
  document.getElementById('naviconclose').classList.remove('active');
}

  return(
  <>
  <div className='header'>
    <div className='heading'>Deva</div>
    <div className='left_content' id='navicon'>
      <ul>
        <li onClick={swapactive}>Swap</li>
        
      </ul>
    </div>
    <div className='right_content' id='naviconone'>
      <ul>
        <li class='active' onClick={chain_popup}>0 DeV</li>
        <li onClick={popup}>connect to a wallet</li>
        <li><BsFillBrightnessHighFill /></li>
        <li><AiOutlineEllipsis /></li>
      </ul>
    </div>
  </div>
  <div className="navicon">
    <div className="icon" onClick={navicon}><AiOutlineMenu /></div>
    <div className="iconclose" onClick={naviconclose} id='naviconclose'><AiOutlineClose /></div>
  </div>

  <div className="popup" id='popup'>
    <div className="overlay"></div>
    <div className="content">
      <div className='close' onClick={popclose}> <AiOutlineClose /></div>
      <p>connect to chain</p>
      <div class='token'>
        <h1>walletconnect</h1>
        <p></p>
      </div>
      <div class='token'>
        <h1>DeGe wallet</h1>
        <p></p>
      </div>
      <div class='token'>
        <h1>coinbase wallet</h1>
        <p>54254</p>
      </div>
      <div class='token'>
        <h1>portis</h1>
        <p></p>
      </div>
      <div className="bottom">New to Ethereum? <a>Learn more about wallets</a></div>
    </div>
  </div>

  <div className="chain_popup" id='chain_popup'>
    <div className="overlay"></div>
    <div className="content">
      <div className='close' onClick={chain_popclose}> <AiOutlineClose /></div>
      <p>connect to Chain</p>
      <div class='token' >
        <h1 vaue='eth' onClick={() => setChain({Chain : 'eth'})}>ETH</h1>
        <p>
        <img src="https://tokens.1inch.io/0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd.png" width="100%" />
        </p>
      </div>
      <div class='token' >
        <h1 vaue="bnb" onClick={() => setChain({Chain : 'bnb'})}>BNB</h1>
        <p><img src="https://etherscan.io/token/images/bnb_28_2.png" width="26" id="token_list_img"/></p>
      </div>
      <div class='token'>
        <h1 value="zenith" onClick={() => setChain({Chain : 'zen'})}>ZENITH</h1>
        <p><img src="https://etherscan.io/token/images/zenith_32.png" width="26" id="token_list_img"/></p>
      </div>
      <div className="bottom">New to Ethereum? <a>Learn more about wallets</a></div>
    </div>
  </div>
  </>
  )
}

export default Header;