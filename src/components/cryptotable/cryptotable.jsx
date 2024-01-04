import React from "react";
import "./cryptotable.css";

function Cryptotable() {
    return (
        <div className="">
            <div className="margin-y">
                <div
                    id="dexscreener-embed"
                    className="relative w-full rounded-lg">
                    <style>
                        {`
                    #dexscreener-embed { padding-bottom: 125%; }
                    @media (min-width: 1400px) { 
                        #dexscreener-embed { padding-bottom: 65%; }
                    }
                    #dexscreener-embed iframe { 
                        position: absolute; 
                        width: 100%; 
                        height: 100%; 
                        top: 0; 
                        left: 0; 
                        border: 0; 
                        border-radius: 15px
                       
                    }
                `}
                    </style>
                    <iframe
                        src="https://dexscreener.com/bsc/0x634E1205Ab0316CaE232F4B1C57b247d74D13da8?embed=1&theme=dark&info=0"
                        className=""></iframe>
                </div>
            </div>
        </div>
    );
}

export default Cryptotable;
