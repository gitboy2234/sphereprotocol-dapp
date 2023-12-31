import React, { useState, useEffect, useRef } from "react";
import "./dashboard.css";
import btc from "../../components/images/BTC.png";
import chip from "../../components/images/card chip.png";
import eth from "../../components/images/ETH.png";
import bnb from "../../components/images/bnb.png";
import Cryptotable from "../../components/cryptotable/cryptotable";
import axios from "axios";

function Dashboard() {
    const [cryptoPrices, setCryptoPrices] = useState({
        bitcoin: 0,
        ethereum: 0,
        tether: 0,
        wbnb: 0,
    });

    useEffect(() => {
        const fetchPrices = () => {
            axios
                .get(
                    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,wbnb&vs_currencies=usd"
                )
                .then((response) => {
                    setCryptoPrices({
                        bitcoin: response.data.bitcoin.usd,
                        ethereum: response.data.ethereum.usd,
                        tether: response.data.tether.usd,
                        wbnb: response.data.wbnb.usd,
                    });
                })
                .catch((error) =>
                    console.error("Error fetching crypto prices:", error)
                );
        };

        // Fetch prices immediately and then set an interval
        fetchPrices();
        const interval = setInterval(fetchPrices, 30000); // Update every minute

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="overflow">
            <section className="middle ">
                <div className="cards">
                    <div className="card">
                        <div className="top">
                            <div className="left">
                                <img src={btc} alt="" />
                                <h2>BTC</h2>
                            </div>

                            <img src={btc} alt="" className="right" />
                        </div>

                        <div className="middle">
                            <h1>
                                <data className="current-price">
                                    ${cryptoPrices.bitcoin}
                                </data>
                                <span id="bitcoin"></span>
                            </h1>
                            <div className="chip">
                                <img src={chip} alt="" />
                            </div>
                        </div>

                        <div className="bottom">
                            <div className="left">
                                <small></small>
                                <h5></h5>
                            </div>
                            <div className="right">
                                <div className="expiry">
                                    <small></small>
                                    <h5></h5>
                                </div>
                                <div className="cvv">
                                    <small></small>
                                    <h5></h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="top">
                            <div className="left">
                                <img src={eth} alt="" />
                                <h2>ETH</h2>
                            </div>
                            <img src={eth} alt="" class="right" />
                        </div>
                        <div className="middle">
                            <h1>
                                <data className="current-price">
                                    ${cryptoPrices.ethereum}
                                </data>
                                <span id="ethereum"></span>
                            </h1>
                            <div className="chip">
                                <img src={chip} alt="" />
                            </div>
                        </div>

                        <div className="bottom">
                            <div className="left">
                                <small></small>
                                <h5></h5>
                            </div>
                            <div class="right">
                                <div className="expiry">
                                    <small></small>
                                    <h5></h5>
                                </div>
                                <div className="cvv">
                                    <small></small>
                                    <h5></h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="top">
                            <div className="left">
                                <img src={bnb} alt="" />
                                <h2>BNB</h2>
                            </div>
                            <img src={bnb} alt="" class="right" />
                        </div>
                        <div className="middle">
                            <h1>
                                <data class="current-price">
                                    ${cryptoPrices.wbnb}
                                </data>
                                <span id="tether"></span>
                            </h1>
                            <div className="chip">
                                <img src={chip} alt="" />
                            </div>
                        </div>

                        <div className="bottom">
                            <div class="left">
                                <small></small>
                                <h5></h5>
                            </div>
                            <div className="right">
                                <div class="expiry">
                                    <small></small>
                                    <h5></h5>
                                </div>
                                <div className="cvv">
                                    <small></small>
                                    <h5></h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="middle ">
                <div className=" ">
                    <Cryptotable />
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
