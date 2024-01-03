import React from "react";
import "./cryptotable.css";

function Cryptotable() {
    return (
        <div className="">
            <div className="margin-y">
                <iframe
                    style={{
                        height: "1000px",
                        width: "100%",
                        borderRadius: "10px",
                        allow: "clipboard-write",
                    }}
                    src="https://www.defined.fi/bsc/0x634e1205ab0316cae232f4b1c57b247d74d13da8?quoteToken=token0&embedded=1&hideTxTable=0&hideSidebar=0&embedColorMode=DEFAULT"
                    id="defined-embed"
                    title="Defined Embed"
                />
            </div>
        </div>
    );
}

export default Cryptotable;
