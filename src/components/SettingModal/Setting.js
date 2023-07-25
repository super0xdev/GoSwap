import { AiOutlineClose,} from "react-icons/ai"
import {PiMagnifyingGlassLight} from "react-icons/pi"
import React, {useState, useEffect} from 'react'

function Setting({setIsShowModal,goswapContract,curAcount}) {

    const [takerAddress, setTakerAddress] = useState('');
    const [takerFee, setTakerFee] = useState(null);
    const [isTaker,setIsTaker] = useState(false);
    const [isTakerFee,setIsTakerFee] = useState(false);
    const [takerEAddress, setTakerEAddress] = useState('');
    const [takerEFee, setTakerEFee] = useState(null);

    useEffect(async ()=>{
        let tmTaker=await goswapContract.methods
        .taker()
        .call();

        let tmTakerFee=await goswapContract.methods
        .takerFee()
        .call();
        
        setTakerAddress(tmTaker);
        setTakerFee(tmTakerFee);
        setTakerEAddress(tmTaker);
        setTakerEFee(tmTakerFee);
    },[])

    const onTakerInChange = (event) => {
        setIsTaker(true);
        setTakerEAddress(event.target.value);
        console.log(takerAddress,takerEAddress);
    }

    const onTakerFeeInChange = (event) => {
        setIsTakerFee(true);
        setTakerEFee(event.target.value);
        console.log(takerFee,takerEFee);
    }

    const onConfirm = async () =>{
        console.log(takerAddress,takerEAddress);
        if(takerEAddress.length != takerAddress.length)
        {
            console.log("Invalid Format");
            return;
        }
        if(takerAddress.toUpperCase() != takerEAddress.toUpperCase())
        {
            goswapContract.methods.setTaker(takerEAddress)
             .send({ from: curAcount });
        }
        if(takerEFee != takerFee)
        {
            goswapContract.methods.setTakerFee(takerEFee)
             .send({ from: curAcount });
        }
        setIsShowModal(false);
    }

    return (
      <div className="w-full h-full fixed left-0 top-0 flex justify-center items-center z-40">
        <div className="fixed w-full h-full left-0 top-0 bg-[#000000] opacity-40 z-40"></div>
        <div className="bg-[#313131] max-w-[420px] rounded-[20px] flex flex-col w-full z-50 fadeshow">
          <div className="flex flex-col space-y-3  px-5 pt-5">
            <div className="flex justify-between">
              <div className="text-white text-[20px]">Setting</div>
              <AiOutlineClose
                className="text-white w-6 h-6 cursor-pointer"
                onClick={() => setIsShowModal(false)}
              ></AiOutlineClose>
            </div>
            <div className="text-[#A9A9A9] text-[12px] flex space-x-1">
                <span>Only</span>
                <span className="text-white">OWNER</span>
                <span>can set taker's address and fee amount(%).</span>
            </div>
            <div className="flex flex-row flex-nowrap items-center w-full gap-4">
                <span style={{color:'gray'}}>Taker</span>
                <input value={isTaker ? takerEAddress : takerAddress} onChange={(event) => onTakerInChange(event)} placeholder="0x123...890" className='bg-transparent text-[16px] text-white outline-none flex-auto px-2 py-1 text-ellipsis placeholder:text-white' style={{border:'solid 1px gray', borderRadius:'6px'}}/>
            </div>
            <div className="flex flex-row flex-nowrap items-center w-full gap-1">
                <span style={{color:'gray'}}>Fee(%)</span>
                <input value={isTakerFee ? takerEFee : takerFee} onChange={(event) => onTakerFeeInChange(event)} placeholder="3" className='bg-transparent text-[16px] text-white outline-none flex-auto px-2 py-1 text-ellipsis placeholder:text-white' style={{border:'solid 1px gray', borderRadius:'6px'}}/>
            </div>
            <button className='flex justify-center bg-[#31CB9E4D] text-[#31CB9E] text-[20px] p-1 outline-none border-1 border-transparent cursor-pointer rounded-full hover:bg-[#31cb9d2f] hover:text-[#31cb9da1]' style={{width:'200px', alignSelf:'center'}} onClick={async()=>{onConfirm();}} >Confirm</button>
            <br/>
          </div>
        </div>
      </div>
    );
}

export default Setting;
