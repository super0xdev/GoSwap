import {AiFillCaretDown} from "react-icons/ai"
import React, { useState} from 'react';

function Slippage(props) {
    const [isDetail, setIsDetail] = useState(false);
    return (
        <div className='w-full px-2'>
            <div className='cursor-pointer flex items-center space-x-1' onClick={()=>setIsDetail(!isDetail)}>
                <div className='text-[#A9A9A9] text-[12px]'>Max Slippage</div>
                <div className='text-[#A9A9A9] text-[12px]'>:</div>
                <div className='text-[#FFFFFF] text-[14px]'>0.5%</div>
                <AiFillCaretDown className={`cursor-pointer text-white w-3 h-3  transition delay-75 rotate-${isDetail?"0":"180"}`}></AiFillCaretDown>
            </div>  
            {isDetail?(
                <div className='fadeshow flex flex-nowrap bg-[#0F0F0F] w-full rounded-[16px] h-9 justify-between text-center p-1 mt-3 an '>
                    <div className='flex'>
                        <button className='px-4 text-[12px] text-[#A9A9A9] w-full border-transparent hover:border-[#565A69] rounded-full border-[1px] transition delay-75'>0.05%</button>
                        <button className='px-4 text-[12px] text-[#A9A9A9] w-full border-transparent hover:border-[#565A69] rounded-full border-[1px] transition delay-75'>0.1%</button>
                        <button className='px-4 text-[12px] text-[#A9A9A9] w-full border-transparent hover:border-[#565A69] rounded-full border-[1px] transition delay-75'>0.5%</button>
                        <button className='px-4 text-[12px] text-[#A9A9A9] w-full border-transparent hover:border-[#565A69] rounded-full border-[1px] transition delay-75'>1%</button>
                    </div>
                        <div className='flex-auto w-0 bg-[#313131] border-[#31CB9E] text-white flex items-center rounded-full border-[1px] px-1'>
                        <input className='bg-transparent outline-none text-right w-full'></input>
                        <div className='flex-auto'>%</div>
                    </div>
                </div>
            ):(
                <></>
            )}
            
        </div>
    );
}

export default Slippage;
