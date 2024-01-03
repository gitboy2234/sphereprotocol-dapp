import React from "react";
import "./cryptotable.css";

function Cryptotable() {
    return (
        <div className="">
            <div className="margin-y">
                <div id="dexscreener-embed">
                    <iframe src="https://dexscreener.com/bsc/0x634E1205Ab0316CaE232F4B1C57b247d74D13da8?embed=1&theme=dark"></iframe>
                </div>
            </div>
        </div>
    );
}

export default Cryptotable;
