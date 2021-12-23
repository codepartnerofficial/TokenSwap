import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { AiFillSetting } from "react-icons/ai";
import { FaExchangeAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineWarning } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { BsArrowDownUp } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";

import {Header} from './Deva.jsx';
import { useMoralis } from "react-moralis";

const serverUrl = "https://ldj2ql65uhog.usemoralis.com:2053/server"; //Server url from moralis.io
const appId = "w406UCeyzHb3MIPsfi9QqMzXdXcskUKB5LW3VGq9"; // Application id from moralis.io


const nativeAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const chainIds = {
  "0x1": "eth",
  "0x38": "bsc",
  "0x89": "polygon",
};

const getChainIdByName = (chainName) => {
  for (let chainId in chainIds) {
    if (chainIds[chainId] === chainName) return chainId;
  }
};

const IsNative = (address) => address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";




const HomePage = () =>{

  const { Moralis } = useMoralis();

  const [tokens, setTokens] = useState([]);
  const [toAmount, setToAmount] = useState();
  const [gasAmount, setGasAmount] = useState();
  const [order, setOrder] = useState();
  //const tokenAddress = '0x006bea43baa3f7a6f765f14f10a1a1b08334ef45';
  const totokenAddress = '0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd';
  let tokenSymbol = 'ETH';
  const [tokenName, setTokenName] = useState([]);
  const [fromAmount, setFormAmount] = useState(0);

  const { account } = useMoralis();
  const [tokenList, setTokenlist] = useState();

  

  const [currentTrade, setCurrentTrade] = useState({
    name: '',
    address: '',
    logo: '',
    symbol: '',
    decimals: 0,
  });

  const [exchangeTrade, setExchangeTrade] = useState({
    name: '',
    address: '',
    logo: '',
    symbol: '',
    decimals: 0,
  });

  const [quote, setQuote] = useState({
    fromToken: '',
    toToken: '',
    toTokenAmount: '',
    fromTokenAmount: '',
    estimatedGas: '',
  })

  const [on, setOn] = useState(0);
  
  const [currentSelectSide, setCurrentSelectSide] = useState();

  const { authenticate, isAuthenticated, user } = useMoralis();

  const Auth = async() => {
    if (!isAuthenticated) {
      authenticate()
    }
  }
  


  useEffect(async () => {

    async function init() {
      await Moralis.initialize(appId);
      Moralis.serverURL = serverUrl;
      await Moralis.enableWeb3();
      const currentUser = Moralis.User.current();
      await Auth();
      await Moralis.initPlugins();
      await Moralis.enableWeb3();
      await listAvailableTokens();
      await getQuote();
    }

    init();

    
    // token info from 1inch
    const listAvailableTokens = async () => {
      //console.log('In listAvailableTokens')
      const result = await Moralis.Plugins.oneInch.getSupportedTokens({
        chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
      });
      
      const tokensObject = await result.tokens;
      //console.log(tokensObject)
      setTokens(tokensObject)
      const tokenName_ = Object.values(tokensObject).map(val => val);
      setTokenName(tokenName_.slice(0, 20));
      
      //const tokensImg = Object.values(tokensObject).map(val => val.logoURI);
      //setTokensImg({ tokensImg: tokensImg})

      /*tokenName.map(e => {
        console.log(e.symbol)
      })*/

    };
    

  }, []);

  const getQuote = async function() {
    console.log(currentTrade.address);
    //console.log(exchangeTrade.address);
    //const fromAmount = 1
    if (!currentTrade.symbol || !exchangeTrade.symbol || !fromAmount) return;
  
    let amount = Number(fromAmount) * 10**currentTrade.decimals;
    const quote = await Moralis.Plugins.oneInch.quote({
      chain: 'eth',
      fromTokenAddress: currentTrade.address,
      toTokenAddress: exchangeTrade.address,
      amount: amount,
    })
    console.log(quote)
    setToAmount({
      toAmount : quote.toTokenAmount.length < 40 ? (quote.toTokenAmount / 10**quote.toToken.decimals).toFixed(8) : 'Too Much!'
    });
    setGasAmount({ gasAmount:quote.estimatedGas })
 
    
    if(fromAmount) {
      setOrder({ order: true })
    }

    setQuote({
      fromToken: quote.fromToken.name,
      fromTokenLogo: quote.fromToken.logoURI,
      fromTokenSymbol: quote.fromToken.symbol,
      toToken: quote.toToken.name,
      toTokenLogo: quote.toToken.logoURI,
      toTokenSymbol: quote.toToken.symbol,
      toTokenAmount: quote.toTokenAmount,
      fromTokenAmount: quote.fromTokenAmount,
      estimatedGas: quote.estimatedGas,
    })
  }

  async function trySwap(props) {
    const tokenSymbol = "BSC";
    console.log('In Try swap')
    let address = Moralis.User.current().get("ethAddress");
    let amount = Number(fromAmount) * 10**currentTrade.decimals;
    if (tokenSymbol !== "ETH") {
      const allowance = await Moralis.Plugins.oneInch.hasAllowance({
        chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
        fromTokenAddress: currentTrade.address, // The token you want to swap
        fromAddress: address, // Your wallet address
        amount: amount,
      });
      console.log('allowance');
      console.log(address)
      if (!allowance) {
        await Moralis.Plugins.oneInch.approve({
          chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
          tokenAddress: currentTrade.address, // The token you want to swap
          fromAddress: address, // Your wallet address
        });
      }
    }
    try {
      await doSwap(address, amount);
      alert("Swap Complete");
    } catch (error) {
      console.log(error);
    }
  }
  
  function doSwap(userAddress, amount) {
    return Moralis.Plugins.oneInch.swap({
      chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
      fromTokenAddress: currentTrade.address, // The token you want to swap
      toTokenAddress: totokenAddress, // The token you want to receive
      amount: amount,
      fromAddress: userAddress, // Your wallet address
      slippage: 1,
    });
  }

  
  

  

  
  console.log(global.variable);

  
  


  const transitionpopup = async() => {
    document.getElementById('transitionpopup').classList.add('active');
  }
  const transitionpopclose = () => {
    document.getElementById('transitionpopup').classList.remove('active');
  }


  const selectockenpop = () => {
    document.getElementById('selectocken').classList.add('active');
    document.getElementById('createpair').classList.remove('active');
    
  }
  
  
  const selectockenclose = async() => {
    document.getElementById('selectocken').classList.remove('active');
    //wait getQuote();
  }
  const importtokopen = () => {
    document.getElementById('managetoken').classList.add('active');
    
  }
  const importtokclose = () => {
    document.getElementById('managetoken').classList.remove('active');
  }
  const manageopen = () => {
    document.getElementById('manage').classList.add('active');
  }
  const manageclose = () => {
    document.getElementById('manage').classList.remove('active');
  }
  const swapopen = async() => {
    document.getElementById('swapcon').classList.add('active');
    await getQuote();
  }
  const swapclose = () => {
    document.getElementById('swapcon').classList.remove('active');
  }
  const swapextopen = async() => {
    document.getElementById('swapext').classList.add('active');
    await trySwap();
  }
  const swapextclose = () => {
    document.getElementById('swapext').classList.remove('active');
    //await trySwap();
  }
  const submitopen = () => {
    document.getElementById('submit').classList.add('active');
  }
  const submitclose = () => {
    document.getElementById('submit').classList.remove('active');
  }
  const createpairopen = () => {
    document.getElementById('createpair').classList.add('active');
  }
  const createpairclose = () => {
    document.getElementById('createpair').classList.remove('active');
  }
  const addliquidityopen = () => {
    document.getElementById('addliquidity').classList.add('active');
  }
  const addliquidityclose = () => {
    document.getElementById('addliquidity').classList.remove('active');
  }
  const willsupplyopen = () => {
    document.getElementById('willsupply').classList.add('active');
  }
  const willsupplyclose = () => {
    document.getElementById('willsupply').classList.remove('active');
  }
  const conformopen = () => {
    document.getElementById('conformation').classList.add('active');
    var a;  
  
   a = setTimeout(fun, 5000);  
  
   function fun() {  
    document.getElementById('transub').classList.add('active');
    document.getElementById('four').classList.add('active');
    document.getElementById('three').classList.add('active');
   }  
  }
  const conformclose = () => {
    document.getElementById('conformation').classList.remove('active');
  }
  const transubclose = () => {
    document.getElementById('transub').classList.remove('active');
  }
  const managefiveclick = () => {
    document.getElementById('five').classList.add('active');
  }
  const removeliqopen= () => {
    document.getElementById('removeliq').classList.add('active');
  }
  const removeliqclose = () => {
    document.getElementById('removeliq').classList.remove('active');
  }
  const willrecieveopen= () => {
    document.getElementById('willrecieve').classList.add('active');
  }
  const willrecieveclose = () => {
    document.getElementById('willrecieve').classList.remove('active');
  }




 return(
  <>
  <div className='dummy' id='dummy'>
  <div className='main'>
    <div className='stepone'>
        <h1>Swap</h1>
        <p onClick={transitionpopup}>< AiFillSetting /></p>
    </div>
    <div className='steptwo'>
        <div className='twoleft'>
          <p id='from'>From</p>
          <input type='text' placeholder='0.0' onChange={event => setFormAmount(event.target.value)} />
          <p id='balance'>Balance : {fromAmount}</p>
        </div>
            <div className='tworight'>
                <p>Max</p>
              <div className='select' onClick={selectockenpop}>
                <div className="left">
                  <span><img src={currentTrade.logo} width="32" id="token_list_img"/></span>
                  <p>{currentTrade.symbol}</p>
                </div>
                <div className="right">
                  <p><AiOutlineDown /></p>
                </div>
              </div>
               
            </div>
    </div>
    <div className='icon'>< FaExchangeAlt /></div>
    
    <div className='steptwo'>
        <div className='twoleft'>
          <p id='from'>To</p>
          <input type='text' placeholder={quote.toTokenAmount} />
          <p id='balance'>{quote.toTokenAmount}</p>
        </div>
            <div className='tworight'>
              <div className='button' onClick={selectockenpop}>Select a Tokan</div>
            </div>
    </div>
    <div className="stepthree">
      <p onClick={swapopen}>
        Swap
      </p>
    </div>
  </div>
  </div>


   {/* TRANSICTION SETTING*/}
  <div className="transitionpopup" id='transitionpopup'>
    <div className="overlay"></div>
    <div className="content">
     <div className="one">
       <p>Transaction Settings</p>
       <div className='close' onClick={transitionpopclose}> <AiOutlineClose /></div>
     </div>
     <div className="two">
       <p>Slippage tolerance <span><AiOutlineQuestionCircle /> <p>Your transaction will revert if the price changes unfavorably by more than this percentage</p> </span></p>
       <div className="button">
         <div className="buttoname"><p>0.1%</p></div>
         <div className="buttoname"><p>0.5%</p></div>
         <div className="buttoname"><p>1%</p></div>
         <input type='text' />
       </div>
     </div>
     <div className="two">
       <p>Transaction deadline <span> <AiOutlineQuestionCircle /> <p>Your transaction will revert if it is pending for more than this long</p></span></p>
     </div>
     <div class='three'>
       <input type='text' />
       <p>Minutes</p>
     </div>
     <div className="four">
       <h1>Interface Settings <span> <AiOutlineQuestionCircle /> </span></h1>
     </div>
     <div className="five">
     <p>Transaction deadline <span> <AiOutlineQuestionCircle /> <p>By passes confirmation modals and allows high sloppage trades. Use at your own risk</p></span></p>
     <input type='checkbox' />
     </div>
     <div className="five">
     <p>Disable Multihops <span> <AiOutlineQuestionCircle /> <p>Restricts swaps to direct pairt only</p></span></p>
     <input type='checkbox' />
     </div>


    </div>
  </div>


   {/* SELECT A TOKEN */}
  <div className="selectocken" id='selectocken'>
    <div className="overlay"></div>
    <div className="content scroll-view">
       <div className="one">
        <p>Select a Token</p>
        <div className='close' onClick={selectockenclose}> <AiOutlineClose /></div>
       </div>
       <div className="two">
         <input type='text' placeholder="Search name or past address" />
       </div>
        
        {
          tokenName.map(e => {
            return (
            <div 
              className="three token_list"
              onClick={() => {
                if(on === 0)
                {
                  setCurrentTrade({
                    name: e.name,
                    address: e.address,
                    logo: e.logoURI,
                    symbol: e.symbol,
                    decimals: e.decimals,
                  });
                  setOn(1);
                  console.log(on)
                selectockenclose();  
                }
                if(currentTrade.symbol !== '' && currentTrade.symbol !== exchangeTrade.symbol && on === 1)
                {
                  setExchangeTrade({
                    name: e.name,
                    address: e.address,
                    logo: e.logoURI,
                    symbol: e.symbol,
                    decimals: e.decimals,
                  });
                  setOn(0);
                  console.log(on);
                  selectockenclose();
                }
              }
            }
            >
            <div className="left">
            <div className='image'>
              <img src={e.logoURI} width="32" id="token_list_img"/>
            </div>
            <div className="text">
            <h1>
                {e.symbol}
              </h1>
              <p>{e.name}</p>
              </div>
          </div>
          <div className="right">
            <p>2.096</p>
          </div>
          </div>)
          })
        }
       <div className="four">
       
       
       </div>

    </div>

  </div>

   {/* Import Token */}
   <div className="managetoken"  id='managetoken'>
   <div className="overlay"></div>
    <div className="content">
      <div className="one">
        <p><AiOutlineLeft /></p>
        <h1>Import Token</h1>
        <p onClick={importtokclose}><AiOutlineClose /></p>
      </div>
      <div className="two">
        <div className="left">
          <div className="image"></div>
        </div>
        <div className="right">
          <div className="top">
            <h3>BNB</h3>
            <p>Binance Coin</p>
          </div>
          <a href='#'>fvbniuer832892nerf</a>
          <div className='bottom'>
            <p>Via Synthetix</p>
            <span></span>
          </div>
        </div>
      </div>
      <div className="three">
        <span><AiOutlineWarning /></span>
        <h2>Trade at your own risk!</h2>
        <p>fnoi fjiowejf jpqo djfjwefj fejwefj  fjwjf jefwpjwep fjwjf
        fiojerg jfwoifj eirofjwpf foHOnioe erijaearis jffia bef cfrea dioaoff 
        ejiroa facjiofao joir</p>
      </div>
      <div className="four" onClick={importtokclose}><h1>Import</h1></div>
    </div>
   </div>

      {/* Token */}
   <div className="manage"  id='manage'>
     <div className="overlay"></div>
     <div className="content">
      <div className="one">
        <p><AiOutlineLeft /></p>
        <h1>Manage</h1>
        <p onClick={manageclose}><AiOutlineClose /></p>
      </div>
      <div className="two">
        <p><span>Tip: </span>Custom tokens are stored locally in your browser</p>
      </div>
      <div className="three"><h2>Token</h2></div>
      <div className="four"><input type='text' /></div>
      <div className="five">
        <div className="left">
          <p>3 Custom Token</p>
        </div>
        <div className="right">
          <p>Clear All</p>
        </div>
      </div>
      <div className="six">
       <div className="default">
        <div className="left">
          <span></span>
          <p>BUSD</p>
        </div>
        <div className="right">
          <span><AiFillDelete /></span>
          <span><AiOutlineLogout /></span>
        </div>
      </div>
      </div>
     </div>

   </div>
    {/* Swap */}
   <div className="swapcon"  id='swapcon'>
     <div className="overlay"></div>
     <div className="content">
      <div className="one">
        <p><AiOutlineLeft /></p>
        <h1>Confirm Swap</h1>
        <p onClick={swapclose}><AiOutlineClose /></p>
      </div>
      <div className="two">
        <div className="left">
          <p>
            {JSON.stringify(quote.fromToken.name)} {quote.fromTokenSymbol}
            </p>
        </div>
        <div className="right">
          <p>{JSON.stringify(quote.fromTokenAmount)}</p>
          <span><img src={quote.fromTokenLogo} width="26" id="token_list_img"/></span>
        </div>
      </div>
      <div className="two">
        <div className="left">
          <p>{JSON.stringify(quote.toToken)}</p>
        </div>
        <div className="right">
          <p>{JSON.stringify(quote.toTokenAmount)}</p>
          <span><img src={quote.toTokenLogo} width="26" id="token_list_img"/></span>
        </div>
      </div>
      <div className="three">
        <p>Output is estimated. If the price changes by more 
        than 0.5% your transaction will revert</p>
      </div>
      <div className="four">
        <div className="left">
          <p>price</p>
        </div>
        <div className="right">
          <p>{JSON.stringify(quote.estimatedGas)} ETH per 1INCH</p>
          <span><BsArrowDownUp /></span>
        </div>
      </div>
      <div className="five">
        <div className="left">
          <p>Minimum received  <span> <AiOutlineQuestionCircle /> <p>Restricts swaps to direct pairt only</p></span></p>
        </div>
        <div className="right">
          <p>9.74 1INCH</p>
        </div>
      </div>
      <div className="five">
        <div className="left">
          <p>Price impact  <span> <AiOutlineQuestionCircle /> <p>Restricts swaps to direct pairt only</p></span></p>
        </div>
        <div className="right">
          <p>0.11</p>
        </div>
      </div>
      <div className="five">
        <div className="left">
          <p>Liquidity Provider Fee  <span> <AiOutlineQuestionCircle /> <p>Restricts swaps to direct pairt only</p></span></p>
        </div>
        <div className="right">
          <p>0.000066 ETH</p>
        </div>
      </div>
      <div className="six" onClick={swapextopen}>
        <p>Confirm</p>
      </div>
     </div>
     </div>


     
    {/* Swap Extra*/}
   <div className="swapext"  id='swapext'>
     <div className="overlay"></div>
     <div className="content">
      <div className="one">
        <h1>Confirm Swap</h1>
        <p onClick={swapextclose}><AiOutlineClose /></p>
      </div>
      <div className="two">
        <h1>0.022 ETH</h1>
        <p>$39.67</p>
      </div>
      <div className="three">
        <div className="left">
          Details
        </div>
        <div className="right">
          Data
        </div>
      </div>
      <div className="four">
        <div className="left">
          <p>Gas fee</p>
          <p id='color'>badge</p>
        </div>
        <div className="right">
          <p>{quote.estimatedGas}</p>
          <p>{quote.toTokenAmount}</p>
        </div>
      </div>
      <div className="five">
        <div className="left">
          <h1>Total</h1>
          <p>(Amount + gas fee)</p>
        </div>
        <div className="right">
          <h1>{JSON.stringify(quote.toTokenAmount + quote.estimatedGas)}</h1>
          <p>0.12$</p>
        </div>
      </div>
      <div className="six">
        <p onClick={swapextclose}>Reject</p>
        <p id='color' onClick={submitopen}>Confirm</p>
      </div>
     </div>

    </div>


    {/* Submited */}
   <div className="submit"  id='submit'>
     <div className="overlay"></div>
     <div className="content">
      <div className="one">
        <p onClick={submitclose} id='cross'><AiOutlineClose /></p>
        <p id='icon'><FaRegCheckCircle /></p>
        <h1>Transaction Submitted</h1>
        <p>View in Etherscan</p>
      </div>
     </div>
    </div>


    {/* Second page */}
    <div className="second_page" id='second_page'>
      <div className="one">
        <div className="left">
          <h1>Your Liquidity</h1>
        </div>
        <div className="right">
          <p onClick={createpairopen}>Create a Pair</p>
          <h3 onClick={addliquidityopen}>Add Liquidity</h3>
        </div>
      </div>
      <div className="two">
        <p>Liquidity provide rewards</p>
        <span><AiOutlineInfoCircle /></span>
      </div>
      <div className="three" id='three'>
        <span><AiOutlineDelete /></span>
        <p>No Liquidity found.</p>
        <p id='next'>Don't see a pool you joined? <a href='#'>Import it.</a></p>
      </div>

      <div className="four" id='four'>
       <div className="left">
        <span></span>
        <span></span>
        <p>ETH/APLC</p>
       </div>
       <div className="right">
        <p onClick={managefiveclick}>Manage</p>
        <p><AiOutlineDown /></p>
       </div>

      </div>

      <div className="five" id='five'>
         <div className="fiveone">
           <p>Your total pool token</p>
           <p>0.0000000325</p>
         </div>
         <div className="fivetwo">
          <div className="left">
           <p>Polleteth</p>
          </div>
          <div className="right">
           <p>0.000325</p>
           <p id='image'></p>
          </div>
         </div>
         <div className="fivethree">
           <p>fnf erh hf4hf fh djoidhgh</p>
         </div>
         <div className="fivefour">
           <p onClick={removeliqopen}>Remove</p>
           <p>Add</p>
         </div>
       </div>



    </div>

     {/* create a pair */}
   <div className="createpair"  id='createpair'>
     <div className="overlay"></div>
     <div className="content">
      <div className="one">
        <p><AiOutlineLeft /></p>
        <h1>Create a Pair</h1>
        <p onClick={createpairclose}><AiOutlineClose /></p>
      </div>
      <div className="two">
        <h2>You are the frist liquidity Provider</h2>
        <p>The ratio of tokens you add will set the price.</p>
        <p>Once you are ok with rate click supply to review.</p>
      </div>
      <div className='three'>
        <div className='threeleft'>
          <p id='from'>From</p>
          <input type='text' placeholder='0.0' />
          <p id='balance'>Balance 0.0</p>
        </div>
            <div className='threeright'>
                <p>Max</p>
                <select name="Token" id="token">
                <option value="ETH">ETH</option>
                <option value="BTH">BTH</option>
                <option value="DTH">DTH</option>
                <option value="CHT">CHT</option>
                </select>
            </div>
    </div>
    <div className='icon'>< AiOutlinePlus /></div>
    
    <div className='three'>
        <div className='threeleft'>
          <p id='from'>To</p>
          <input type='text' placeholder='0.0' />
          <p id='balance'>Balance 0.0</p>
        </div>
            <div className='threeright'>
              <div className='button'  onClick={selectockenpop}>Select a Token</div>
            </div>
    </div>
    <div className="four">
      <div className="button">Invalid Pair</div>
    </div>
      </div>
    </div>


   {/* SELECT A TOKEN */}
   <div className="selectocken" id='selectocken'>
    <div className="overlay"></div>
    <div className="content">
       <div className="one">
        <p>Select a Token</p>
        <div className='close'> </div>
       </div>
       <div className="two">
         <input type='text' placeholder="Search name or past address" />
       </div>
       
       <div className="three">
         <div className="left">
           <div className='image'></div>
           <div className="text"><h1>ETH</h1><p>Ether</p></div>
         </div>
         <div className="right">
           <p></p>
         </div>
       </div>
       <div className="four">
       <FaBars />
       <p>Manage</p>
       </div>

    </div>

  </div>


     {/* add liquidity */}
     <div className="addliquidity"  id='addliquidity'>
     <div className="overlay"></div>
     <div className="content">
      <div className="one">
        <p onClick={addliquidityclose}><AiOutlineLeft /></p>
        <h1>Add Liquidity</h1>
        <p><AiOutlineSetting /></p>
      </div>
      <div className="two">
        <p>Tip: Once you are ok with rate click supply to review. oifvehroi
        Once you are ok with rate click supply to review.</p>
      </div>
      <div className='three'>
        <div className='threeleft'>
          <p id='from'>From</p>
          <input type='text' placeholder='0.0' />
          <p id='balance'>Balance 0.0</p>
        </div>
            <div className='threeright'>
                <p>Max</p>
                <select name="Token" id="token">
                <option value="ETH">ETH</option>
                <option value="BTH">BTH</option>
                <option value="DTH">DTH</option>
                <option value="CHT">CHT</option>
                </select>
            </div>
    </div>
    <div className='icon'>< AiOutlinePlus /></div>

      <div className='three'>
        <div className='threeleft'>
          <p id='from'>From</p>
          <input type='text' placeholder='0.0' />
          <p id='balance'>Balance 0.0</p>
        </div>
            <div className='threeright'>
                <p>Max</p>
                <select name="Token" id="token">
                <option value="ETH">ETH</option>
                <option value="BTH">BTH</option>
                <option value="DTH">DTH</option>
                <option value="CHT">CHT</option>
                </select>
            </div>
    </div>
    <div className="pricepool">
      <p>Price and pool share</p>
      <div className="middle">
        <div className="one">
          <h3>44564</h3>
          <p>dffer fgreer</p>
        </div>
        <div className="one">
          <h3>44564</h3>
          <p>dffer fgreer</p>
        </div>
        <div className="one">
          <h3>44564</h3>
          <p>dffer fgreer</p>
        </div>
      </div>
    </div>
    <div className="four" onClick={willsupplyopen}>
      <div className="button">Supply</div>
    </div>
    <div className="lastcontent">
      <p>fr reg rfver gbrth regeg htyjhnty grt grt hrth gbgh
      grg hyjhjg  jferj hewiuhh fhh foej fhoia her hreoihe
      hreiuh ijroiejr fjojf jhireo hoi</p>
    </div>
      </div>
    </div>

   {/* You will supply*/}
   <div className="willsupply" id='willsupply'>
    <div className="overlay"></div>
    <div className="content">
       <div className="one">
        <h3>You will supply</h3>
        <p onClick={willsupplyclose}>< AiOutlineClose /></p>
       </div>
       <div className="two">
         <div className="left">
           <p>0.001524</p>
         </div>
         <div className="right">
           <p>ETH</p>
           <span></span>
         </div>
       </div>
       <div className="two">
         <div className="left">
           <p>0.001524</p>
         </div>
         <div className="right">
           <p>ETH</p>
           <span></span>
         </div>
       </div>
       <div className="three">
         <p>fdhn fo eaeiohf heaoie ehfwfh fieofw wehfeiwh
         fenoieoi fhwejhn eoewj ejfwoh fhf fiewiof ofijoif jfowe jw</p>
       </div>
       <div className="four">
         <h2>Deva ETH/AMPL</h2>
       </div>
       <div className="five">
         <div className="fiveone">
           <div className="left">
             <p>fdd gfreg feaf</p>
           </div>
           <div className="right">
             <p>0.001235</p>
             <span></span>
             <span></span>
           </div>
         </div>
         <div className="fivetwo">
           <div className="left">
             <p>price</p>
           </div>
           <div className="right">
             <p>htrhbr gt g ghy yhjty </p>
             <p>df refgvrv gres gv gh grt</p>
           </div>
         </div>
         <div className="fivethree">
           <div className="left">
             <p>share of pool</p>
           </div>
           <div className="right">
             <p>frfgvegveeaerh </p>
           </div>
         </div>
       </div>
       <div className="six" onClick={conformopen}>
         <p>Confirm</p>
       </div>
   </div>
   </div>


   {/* You will supply*/}
   <div className="conformation" id='conformation'>
    <div className="overlay"></div>
    <div className="content">
       <div className="one">
        <p  onClick={conformclose}>< AiOutlineClose /></p>
       </div>
       <div className="two">
        <p>< AiOutlineLoading3Quarters /></p>
       </div>
       <div className="three">
        <h1>Waiting for conformation</h1>
        <p>fio ohg oehoe fodf jfofj hf</p>
        <p>fio ohg fodf jfofj hf</p>
       </div>
    </div>
    </div>


 {/* Transaction subbmites*/}
 <div className="transub" id='transub'>
    <div className="overlay"></div>
    <div className="content">
       <div className="one">
        <p  onClick={transubclose}>< AiOutlineClose /></p>
       </div>
       <div className="two">
        <p>< AiOutlineCheckCircle /></p>
       </div>
       <div className="three">
        <h1>Transaction Submitted</h1>
        <p>View on Etherscane</p>
       </div>
    </div>
    </div>

     {/* Remove liquidity */}
     <div className="removeliq"  id='removeliq'>
     <div className="overlay"></div>
     <div className="content">
      <div className="one">
        <p onClick={removeliqclose}><AiOutlineLeft /></p>
        <h1>Remove liquidity</h1>
        <p><AiOutlineSetting /></p>
      </div>
      <div className="two">
        <p>Tip: fwoie er reeoi joajo jw emnvovm oigje9wa8 jf j fjasms asj
        on joij jfeg gjsn o foe98tgu osj vvkm fj9gj jg</p>
      </div>
      <div className="three">
        <p>Amount</p>
        <p>Details</p>
      </div>
      <div className="four">
        <p>62%</p>
      </div>
      <div className="five">
        <p>20%</p>
        <p>40%</p>
        <p>60%</p>
        <p>Max</p>
      </div>
      <div className="six">
        <div className="left">
          <p>0.0000013258</p>
        </div>
        <div className="right">
          <p>ETH</p>
          <span></span>
        </div>
      </div>
      <div className="seven">
        <div className="left">
          <p>Price</p>
        </div>
        <div className="right">
          <p>gej f fh </p>
          <p>erej jj ojcc</p>
        </div>
      </div>
      <div className="eight">
        <p onClick={willrecieveopen}>Approve</p>
        <p onClick={removeliqclose}>Remove</p>
      </div>

    </div>
    </div>

   {/* You will Recieve*/}
   <div className="willrecieve" id='willrecieve'>
    <div className="overlay"></div>
    <div className="content">
       <div className="one">
        <h3>You will Recieve</h3>
        <p onClick={willrecieveclose}>< AiOutlineClose /></p>
       </div>
       <div className="two">
         <div className="left">
           <p>0.001524</p>
         </div>
         <div className="right">
           <p>ETH</p>
           <span></span>
         </div>
       </div>
       <div className="two">
         <div className="left">
           <p>0.001524</p>
         </div>
         <div className="right">
           <p>ETH</p>
           <span></span>
         </div>
       </div>
       <div className="three">
         <p>fdhn fo eaeiohf heaoie ehfwfh fieofw wehfeiwh
         fenoieoi fhwejhn eoewj ejfwoh fhf fiewiof ofijoif jfowe jw</p>
       </div>
       <div className="four">
         <h2>Deva ETH/AMPL</h2>
       </div>
       <div className="five">
         <div className="fiveone">
           <div className="left">
             <p>fdd gfreg feaf</p>
           </div>
           <div className="right">
             <p>0.001235</p>
             <span></span>
             <span></span>
           </div>
         </div>
         <div className="fivetwo">
           <div className="left">
             <p>price</p>
           </div>
           <div className="right">
             <p>htrhbr gt g ghy yhjty </p>
             <p>df refgvrv gres gv gh grt</p>
           </div>
         </div>
         <div className="fivethree">
           <div className="left">
             <p>share of pool</p>
           </div>
           <div className="right">
             <p>frfgvegveeaerh </p>
           </div>
         </div>
       </div>
       <div className="six" onClick={conformopen}>
         <p>Confirm</p>
       </div>
   </div>
   </div>





  </>
)
}

export default HomePage;