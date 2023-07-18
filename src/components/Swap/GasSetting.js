import React, { useState} from 'react';

function GasSetting(props) {
    const [isLowestGas, setIsLowestGas] = useState(false);
    return (
        <div className='flex bg-[#0F0F0F] justify-center rounded-full p-[2px] h-9'>
            <button className={`${isLowestGas?"bg-transparent text-[#A9A9A9]":"bg-[#313131] text-white"} text-[12px] w-1/2 rounded-[12px]`} onClick={()=>setIsLowestGas(false)}>Maximum Return</button>
            <button className={`${!isLowestGas?"bg-transparent text-[#A9A9A9]":"bg-[#313131] text-white"} text-[12px] w-1/2  rounded-[12px]`} onClick={()=>setIsLowestGas(true)}>Lowest Gas</button>
        </div>
    );
}

export default GasSetting;
