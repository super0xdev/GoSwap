import '../App.css';
import {BiSolidWalletAlt} from "react-icons/bi"
import {AiFillCaretDown, AiOutlineReload, AiOutlineSetting, AiOutlineSwap} from "react-icons/ai"
import {MdSwapVert} from "react-icons/md"
import React, {useEffect, useState, useCallback} from 'react';
import { useWallet } from "../context/WalletContext";
import { web3Modal } from "../helpers/web3Modal";
import Web3 from "web3";
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import TokenLists from '../components/TokenListModal/TokenLists';
import Setting from '../components/SettingModal/Setting';
import Slippage from '../components/Swap/Slippage';
import GasSetting from '../components/Swap/GasSetting';
import tokenETHList from "../tokenETHList.json";
import config from '../constants/config';
import ClipLoader from 'react-spinners/ClipLoader'

const ethers = require("ethers");
const axios = require('axios');
const WETH = {addr: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', decimal: 18};

function Swap() {
    const [web3, setWeb3] = useState();
    const [curAcount, setCurAcount] = useState('');
    const [injectedProvider, setInjectedProvider] = useState();
    const [quoterContract, setQuoterContract] = useState();
    const [isShowModal, setIsShowModal] = useState(false);
    const [isSettingModal, setIsSettingModal] = useState(false);
    const [tokenOne,setTokenOne] = useState(tokenETHList[0]);
    const [tokenTwo,setTokenTwo] = useState(tokenETHList[2]);
    const [isTokenOne,setIsTokenOne] = useState(false);
    const [amountIn, setAmountIn] = useState(0)
    const [amountOut, setAmountOut] = useState(0)
    const { wallet, setWallet, setConnection } = useWallet();
    const [isConnected, setIsConnected] = useState(false);
    const [loadingInProgress, setLoading] = useState(false);
    const [oneBalance, setOneBalance] = useState(0);
    const [ownerAddress,setOwnerAddress] = useState('');
    const [isOwner,setIsOwner] = useState(false);
    //load abi for integrating contract
    const web3t = new Web3(window.ethereum);
    const goswapContract = new web3t.eth.Contract(config.goswapAbi, config.goswapAddress);
    const logoutOfWeb3Modal = async () => {
        web3Modal.clearCachedProvider();
        if (
          injectedProvider &&
          injectedProvider.provider &&
          typeof injectedProvider.provider.disconnect === "function"
        ) {
          await injectedProvider.provider.disconnect();
        }
        setIsConnected(false);
        setConnection(false);
        window.location.reload();
    };

    const loadWeb3Modal = useCallback(async () => {
        //RUN_MODE("Connecting Wallet...");
        const provider = await web3Modal.connect();
        const web3Provider = new Web3(provider);
        setInjectedProvider(web3Provider);
        var acc = null;
        try {
          acc = provider.selectedAddress
            ? provider.selectedAddress
            : provider.accounts[0];
        } catch (error) {
          acc = provider.address;
          console.log("acc======",acc);
        }
        setWallet({account:acc, connection:true});
        const tprovider = new ethers.providers.Web3Provider(window.ethereum)
        const tmp = new ethers.Contract(
          config.uniswapV3QuoterAddress,
          Quoter.abi,
          tprovider
        )
        
        setQuoterContract(tmp);

        setWeb3(web3Provider);
        setCurAcount(acc);
        setIsConnected(true);
    
        provider.on("chainChanged", (chainId) => {
          //RUN_MODE(`chain changed to ${chainId}! updating providers`);
          setInjectedProvider(web3Provider);
          logoutOfWeb3Modal();
        });
    
        provider.on("accountsChanged", () => {
          // RUN_MODE(`curAcount changed!`);
          setInjectedProvider(web3Provider);
          logoutOfWeb3Modal();
        });
    
        // Subscribe to session disconnection
        provider.on("disconnect", (code, reason) => {
          //RUN_MODE(code, reason);
          // alert("loadWeb3Modal accountsChanged");
          logoutOfWeb3Modal();
        });
        // eslint-disable-next-line
    }, [setInjectedProvider]);

    useEffect(async () => {
        console.log("wallet:",wallet);    
        
        if (wallet.connection == true && curAcount == '') {
          const t_pro = window.ethereum ? new Web3(window.ethereum) : null;
          console.log(t_pro);
          setWeb3(t_pro);
          setCurAcount(wallet.account);
          setIsConnected(true);

          const tprovider = new ethers.providers.Web3Provider(window.ethereum)
          const tmp = new ethers.Contract(
            config.uniswapV3QuoterAddress,
            Quoter.abi,
            tprovider
          )
          setQuoterContract(tmp);
          setOwnerAddress(await goswapContract.methods
          .owner()
          .call());


        } else if (wallet.connection == false) {
          console.log("--------disconnected---------");
        }
    }, [wallet]);

    useEffect(()=>{
      if(ownerAddress != ''){
        //console.log(ownerAddress, curAcount);
        if(ownerAddress.toUpperCase() == curAcount.toUpperCase()){
          setIsOwner(true);
        }
        else{
          setIsOwner(false);
        }
      }
    },[ownerAddress])

    useEffect(async () => {
      if(curAcount=='') return;
      const token = tokenOne;
      if(token.ticker == 'ETH')
      {
        const balance = await web3t.eth.getBalance(curAcount);
        setOneBalance((balance / 10**18).toFixed(3));
      }
      else
      {
        const tContract = new web3.eth.Contract(config.erc20Abi, token.address);
        const balance = await tContract.methods
          .balanceOf(curAcount)
          .call();
        setOneBalance((balance / 10**token.decimals).toFixed(3));
      }
    }, [curAcount, tokenOne, setTokenOne])

    useEffect(async () => {
      if(amountIn == 0 || curAcount == '') return;
      const wETH = tokenETHList[1];
      setLoading(true);
      if(tokenOne.name == tokenTwo.name) {
        setAmountOut(amountIn);
      }
      else if(tokenOne.ticker == 'WETH' || tokenOne.ticker == 'ETH') {
        const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
          wETH.address,
          tokenTwo.address,
          3000,
          ethers.utils.parseUnits(amountIn.toString(), wETH.decimals),
          0
        )
        console.log(quotedAmountOut, 10**tokenTwo.decimals, quotedAmountOut/10**tokenTwo.decimals);
        setAmountOut(quotedAmountOut/10**tokenTwo.decimals)
      }
      else if(tokenTwo.ticker == 'ETH' || tokenTwo.ticker == 'WETH') {
        const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
          tokenOne.address,
          wETH.address,
          3000,
          ethers.utils.parseUnits(amountIn.toString(), tokenOne.decimals),
          0
        )
        setAmountOut(quotedAmountOut/10**wETH.decimals)
      }
      else {
        console.log(amountIn, tokenOne, tokenTwo);
        const quoteETH = await quoterContract.callStatic.quoteExactInputSingle(
          tokenOne.address,
          WETH.addr,
          3000,
          ethers.utils.parseUnits(amountIn.toString(), tokenOne.decimals),
          0
        )
        const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
          WETH.addr,
          tokenTwo.address,
          3000,
          ethers.utils.parseUnits((quoteETH).toString(), 1),
          0
        )
        console.log(quotedAmountOut, 10**tokenTwo.decimals, quotedAmountOut/10**tokenTwo.decimals);
        setAmountOut((quotedAmountOut/10**tokenTwo.decimals).toFixed(12))
      }
      setLoading(false);
    }, [amountIn, setAmountIn, tokenOne, setTokenOne, tokenTwo, setTokenTwo])

    const selTokenOne = async (token)=>{
        if(isTokenOne) 
        {
          if(token.ticker == 'ETH')
          {
            const balance = await web3t.eth.getBalance(curAcount);
            setOneBalance((balance / 10**18).toFixed(3));
          }
          else
          {
            const tContract = new web3.eth.Contract(config.erc20Abi, token.address);
            const balance = await tContract.methods
              .balanceOf(curAcount)
              .call();
            console.log(10**token.decimals);
            setOneBalance((balance / 10**token.decimals).toFixed(3));
          }
          if(token.ticker == tokenTwo.ticker) setTokenTwo(tokenOne);
          setTokenOne(token);
        }  
        else {
          if(token.ticker == tokenOne.ticker){
            setTokenOne(tokenTwo);
          }
          setTokenTwo(token);
        }
    }

    const onAmountInChange = (event) => {
      setAmountIn(event.target.value);
    }

    const onAmountOutChange = (event) => {
      setAmountOut(event.target.value);
    }

    const handleSwap = async () => {
      setLoading(true);
      if(tokenOne.ticker == "ETH") //mode 0
      {
        goswapContract.methods
        .sendEthToSth(tokenTwo.address)
        .send({
          from: curAcount,
          value: web3.utils.toWei(amountIn.toString(), "ether"),
        })
        .then(() => {
          setLoading(false);
          console.log('Done');
        })
        .catch((err) => {
          setLoading(false);
        })
      }
      else
      {
        const tContract = new web3.eth.Contract(config.erc20Abi, tokenOne.address);
        await tContract.methods
          .approve(
            config.goswapAddress,
            (amountIn*10**tokenOne.decimals).toString()
          )
          .send({ from: curAcount });

        let mode;
        if(tokenTwo.ticker == "ETH") mode =1;
        else mode=2;

        goswapContract.methods.inputSwap(tokenOne.address, tokenTwo.address,(amountIn * 10 ** tokenOne.decimals).toString(),mode)
        .send({ from: curAcount });
      }
    }
    
    const exchangeTokens = () => {
      const tmp = tokenOne;
      setTokenOne(tokenTwo);
      setTokenTwo(tmp);

      setAmountIn(parseInt(amountOut))
    }
    return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center font-medium relative">
        {loadingInProgress ? 
          <div className='flex items-center absolute text-white' style={{placeContent:'center', width:'100%', height:'100%', background:'#ffffff55'}}>
            <span className='absolute'>Please wait...</span>
            <ClipLoader color={'#fff'} loading={loadingInProgress} size={150} />
          </div> : <></>}
        {/* Modal */}
        {isShowModal?(
            <TokenLists setIsShowModal={setIsShowModal} selTokenOne={selTokenOne}></TokenLists>
        ):(<></>)}
        {isSettingModal && <Setting setIsShowModal={setIsSettingModal} goswapContract={goswapContract} curAcount={curAcount}/>}
        {/* Body */}
        <div className='relative max-w-[425px] bg-[#1C1C1C] w-full rounded-[20px] p-4 flex flex-col space-y-3 '>                
            <div className='flex justify-between text-white items-center' style={{marginLeft:'15px', marginRight:'12px'}}>
              <span>Swap</span>
              {isOwner && <AiOutlineSetting className='cursor-pointer' onClick={() => setIsSettingModal(true)} />}
            </div>
            <div className='flex flex-col w-full bg-[#0F0F0F] rounded-[16px] p-3 space-y-3'>
                <div className='flex justify-end w-full'>
                    <div className='flex items-center'><BiSolidWalletAlt className='text-[#A9A9A9]' width={16} height={16}></BiSolidWalletAlt> &nbsp; <span className='text-[#A9A9A9]'>{oneBalance}</span> </div>
                </div>
                <div className='flex flex-row flex-nowrap items-center w-full'>
                    <input value={amountIn}  onChange={(event) => onAmountInChange(event)} className='bg-[#0F0F0F] text-[24px] text-white outline-none border-none flex-auto w-0 text-ellipsis' />
                    {/* <div className='text-[#505050] mr-2'>~$229,694</div> */}
                    <button className='bg-[#1C1C1C] rounded-full flex pl-2 pt-[6px] pb-[6px] items-center hover:bg-[#383838]' onClick={()=>{setIsShowModal(true); setIsTokenOne(true);}}>
                        <img className='w-4 h-4' src={tokenOne.img}></img>
                        <span className='text-[#A9A9A9] text-[20px] ml-2'>{tokenOne.ticker}</span>
                        <div className='w-6 h-6 flex justify-center items-center'><AiFillCaretDown className='text-[#A9A9A9] w-3 h-3'></AiFillCaretDown></div>
                    </button>
                </div>
            </div>
            <div className='flex justify-between w-full'>
                <div className='flex items-center  text-[#A9A9A9] space-x-1'>
                    <AiOutlineReload></AiOutlineReload>
                    <span className='text-[12px]'>1 ETH = 1866.57 USDT</span>
                    <AiOutlineSwap></AiOutlineSwap>
                </div>
                <div onClick={exchangeTokens} className='w-6 h-6 rounded-full bg-[#292929] text-[#A9A9A9] transition delay-[20] hover:bg-[#353535] hover:text-white cursor-pointer flex justify-center items-center'>
                    <MdSwapVert width={12} height={12}></MdSwapVert>
                </div>
            </div>
            <div className='flex flex-col w-full bg-[#0F0F0F] rounded-[16px] p-3 space-y-3'>
                <div className='flex justify-between w-full'>
                    <div className=' underline-offset-1 text-[#A9A9A9] text-[14px]'>Est. output</div>
                    {/* <div className='flex items-center'><BiSolidWalletAlt className='text-[#A9A9A9]' width={16} height={16}></BiSolidWalletAlt> &nbsp; <span className='text-[#A9A9A9]'>0</span> </div> */}
                </div>
                <div className='flex flex-row flex-nowrap items-center w-full'>
                    <input value={amountOut} onChange={(event) => onAmountOutChange(event)} className='bg-[#0F0F0F] text-[24px] text-[#606060] outline-none border-none flex-auto w-0 text-ellipsis' disabled></input>
                    {/* <div className='text-[#505050] mr-2'>~$229,694</div> */}
                    <button className='bg-[#1C1C1C] rounded-full flex pl-2 pt-[6px] pb-[6px] items-center hover:bg-[#383838]' onClick={()=>{setIsShowModal(true); setIsTokenOne(false);}}>
                        <img className='w-4 h-4' src={tokenTwo.img}></img>
                        <span className='text-[#A9A9A9] text-[20px] ml-2'>{tokenTwo.ticker}</span>
                        <div className='w-6 h-6 flex justify-center items-center'><AiFillCaretDown className='text-[#A9A9A9] w-3 h-3'></AiFillCaretDown></div>
                    </button>
                </div>
            </div>  
            <Slippage/>
            <GasSetting/>
            <div className='w-full flex gap-4'>
                {isConnected ? (
                  <button
                  className='w-1/2 bg-[#31CB9E4D] text-[#31CB9E] text-[14px] p-3 outline-none border-1 border-transparent cursor-pointer rounded-full hover:bg-[#31cb9d2f] hover:text-[#31cb9da1]'
                    onClick={() => {
                      logoutOfWeb3Modal();
                    }}
                  >
                    {curAcount.slice(0, 8) +
                      "..." +
                      curAcount.slice(34)}
                  </button>
                ) : (
                    <button
                    className='w-1/2 bg-[#31CB9E4D] text-[#31CB9E] text-[14px] p-3 outline-none border-1 border-transparent cursor-pointer rounded-full hover:bg-[#31cb9d2f] hover:text-[#31cb9da1]'
                      onClick={() => {
                        loadWeb3Modal();
                      }}
                    >
                      Connect Wallet
                    </button>
                )}
                
                {isConnected ? <button onClick={handleSwap} className='w-1/2 bg-[#31CB9E4D] text-[#31CB9E] text-[14px] p-3 outline-none border-1 border-transparent cursor-pointer rounded-full hover:bg-[#31cb9d2f] hover:text-[#31cb9da1]'>Swap</button>
                : <button disabled className='w-1/2 text-[14px] p-3 outline-none border-1 border-transparent rounded-full' style={{background:'#1165344D', color:'#116534'}}>Swap</button>}

            </div>

            
        </div>
        <div className="absolute inset-0" style={{zIndex:'-1'}}>
            <video autoPlay loop muted className="absolute h-full w-full object-cover">
                <source src="background-header.mp4" type="video/mp4"></source>
            </video>
        </div>
    </div>
    );
}




export default Swap;
