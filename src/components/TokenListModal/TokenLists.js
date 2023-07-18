import { AiOutlineClose,} from "react-icons/ai"
import {PiMagnifyingGlassLight} from "react-icons/pi"
import TokenSelectListItem from "./TokenSelectListItem";
import TokenListItem from "./TokenListItem";
import tokenETHList from "../../tokenETHList.json";
import React, {useState, useEffect} from 'react'

function TokenLists({setIsShowModal, selTokenOne}) {

    useEffect(()=>{

    },[])

    const modifyToken=(index)=>{
      setIsShowModal(false);
      selTokenOne(tokenETHList[index]);
    }

    return (
      <div className="w-full h-full fixed left-0 top-0 flex justify-center items-center z-40">
        <div className="fixed w-full h-full left-0 top-0 bg-[#000000] opacity-40 z-40"></div>
        <div className="bg-[#313131] max-w-[420px] rounded-[20px] flex flex-col w-full z-50 fadeshow">
          <div className="flex flex-col space-y-3 border-b-[1px] border-b-[#565A69] px-5 pt-5">
            <div className="flex justify-between">
              <div className="text-white text-[20px]">Select a token</div>
              <AiOutlineClose
                className="text-white w-6 h-6 cursor-pointer"
                onClick={() => setIsShowModal(false)}
              ></AiOutlineClose>
            </div>
            <div className="text-[#A9A9A9] text-[12px] flex space-x-1">
              <span>You can search and select</span>
              <span className="text-white">any token</span>
              <span>on GoSwap</span>
            </div>
          
            {/* <div className="relative h-12 w-full flex bg-[#0F0F0F] rounded-full transition delay-75 text-[17px] border-[1px] border-transparent active:border-[#31CB9E] items-center justify-center">
              <input
                className="text-[15px] pt-2 pl-4 pb-3 pr-8 bg-transparent text-white outline-none w-full placeholder-white placeholder-opacity-20"
                placeholder="Search by token name, token symbol or address"
              ></input>
              <PiMagnifyingGlassLight className="absolute right-3 top-3 text-white text-opacity-20"></PiMagnifyingGlassLight>
            </div> */}
            {/* <div className="flex flex-wrap gap-3">
              <TokenSelectListItem/>
            </div> */}
            
            <div className="flex gap-4 pb-3">
              <div className="text-[#31CB9E] cursor-pointer">All</div>
              <div className="text-white cursor-pointer">Imported</div>
            </div>
          </div>
          <div className="token-list w-full h-96 overflow-y-auto">
            <div className="flex flex-col">
              {tokenETHList?.map((token,index)=>{
                return(
                  <TokenListItem token={token} index={index} modifyToken={modifyToken}/>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
}

export default TokenLists;
