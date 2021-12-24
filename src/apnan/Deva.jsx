import React, { useState, useEffect } from 'react';
import './index.css';
import { BsFillBrightnessHighFill } from "react-icons/bs";
import { AiOutlineEllipsis } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai";

import { useMoralis } from "react-moralis";
import Color from 'color';

const serverUrl = "https://1pf18efvmoil.usemoralis.com:2053/server"; //Server url from moralis.io
const appId = "Dd51OOJJLmU2FhBBYZsXpuhdG656X3zlFAJruFyY"; // Application id from moralis.io



const Header = (props) => {

  const { Moralis } = useMoralis();
  const { authenticate, isAuthenticated, user } = useMoralis();
  const [address, setAddress] = useState('');
  const [icon, setIcon] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      setAddress(user.attributes.ethAddress);
    }
  }, [isAuthenticated]);

  const [chain, setChain] = useState('https://ethereum.org/static/a110735dade3f354a46fc2446cd52476/db4de/eth-home-icon.webp')

  //console.log(JSON.stringify(chain))

  global.variable = chain;
  //console.log(JSON.stringify(chain));

  

const popup = async() => {
  document.getElementById('popup').classList.remove('active');
  document.getElementById('address').innerHTML = address.slice(0, 5) +"....." +address.slice(35, 40)
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
    <div className='heading'>Zenith Dex</div>
    <div className='left_content' id='navicon'>
      <ul>
        <li onClick={swapactive}>Swap</li>
        
      </ul>
    </div>
    <div className='right_content' id='naviconone'>
      <ul>
        <li class='active' onClick={chain_popup}>
          <img src = {chain} />
        </li>
        <li onClick={popup} id='address'>connect to a wallet</li>
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
        <h1 vaue='eth' onClick={(e) => setChain({Chain : 'https://ethereum.org/static/a110735dade3f354a46fc2446cd52476/db4de/eth-home-icon.webp'})}>ETH</h1>
        <h1>
        <img src='https://ethereum.org/static/a110735dade3f354a46fc2446cd52476/db4de/eth-home-icon.webp' width="26" />
        </h1>
      </div>
      <div class='token' >
        <h1 vaue="bnb" onClick={() => setChain({Chain : 'https://www.freelogovectors.net/wp-content/uploads/2021/10/binance-coin-bnb-logo-freelogovectors.net_.png" width="26" id="token_list_img'})}>BSC</h1>
        <h1><img src="https://www.freelogovectors.net/wp-content/uploads/2021/10/binance-coin-bnb-logo-freelogovectors.net_.png" width="26" id="token_list_img'"/></h1>
      </div>
      <div class='token'>
        <h1 value="zenith" onClick={() => setChain({Chain : 'https://www.zenithchain.co/assets/images/logo.png'})}>ZENITH</h1>
        <h1><img src="https://www.zenithchain.co/assets/images/logo.png" width="26" id="token_list_img"/></h1>
      </div>
      <div className="bottom">New to Ethereum? <a>Learn more about wallets</a></div>
    </div>
  </div>
  </>
  )
}

export default Header;