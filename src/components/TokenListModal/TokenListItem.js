import {AiOutlineStar, AiFillStar} from "react-icons/ai"
import React, {useState} from 'react';

function TokenListItem(props) {
    const [isStar, setIsStar] = useState(false);

    return (
        <div className="bg-transparent hover:bg-[#0F0F0F] cursor-pointer transition delay-[30] flex items-center justify-between px-5 py-1"  key={props.index} onClick={()=>props.modifyToken(props.index)}>
            <div className="flex items-center gap-1">
                <img
                className="w-8 h-8 bg-slate-500 rounded-full"
                src={props.token.img}
                ></img>
                <div className="flex flex-col">
                <span className="text-white">{props.token.ticker}</span>
                <span className="text-[#A9A9A9]">{props.token.name}</span>
                </div>
            </div>
            {!isStar?(
                <AiOutlineStar className="transition delay-[20] text-[#505050] hover:text-[#31CB9E] w-6 h-6" onClick={()=>setIsStar(true)}></AiOutlineStar>
            ):(
                <AiFillStar className="transition delay-[20] text-[#31CB9E] hover:text-[#505050] w-6 h-6" onClick={()=>setIsStar(false)}></AiFillStar>
            )}
            
        </div>   
    );
}

export default TokenListItem;
