import ethereum from "../../asset/img/ethereum.png"

function TokenSelectListItem() {
    return (
        <div className="border-[1px] border-[#565A69] bg-transparent transition delay-[20] hover:border-[#676B70] cursor-pointer hover:bg-[#1F1F1F] p-[6px] rounded-[10px] flex gap-2 items-center">
            <img className="w-4 h-4" src={ethereum}></img>
            <div className="text-white text-[16px]">ETH</div>
        </div>        
    );
}

export default TokenSelectListItem;
