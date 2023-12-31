import React, { useState, useEffect } from "react";
import "./cryptotable.css";
import axios from "axios";

function Cryptotable() {
    const [cryptoData, setCryptoData] = useState([]);

    const fetchTopCoins = async () => {
        try {
            const response = await axios.get(
                "http://188.166.229.235:3001/api/top-coins"
            );
            setCryptoData(response.data.data); // Assuming the data is nested under response.data.data
        } catch (error) {
            console.error("Error fetching top coins:", error);
        }
    };

    useEffect(() => {
        fetchTopCoins();

        const interval = setInterval(() => {
            fetchTopCoins();
        }, 30000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="">
            <div className="">
                <div className="font-text div-bg">
                    <span>Top 10 Cryptocurrency</span>
                </div>
                <div className="crypto-table-container">
                    <table className="crypto-table ">
                        <thead>
                            <tr className="font-th ">
                                <th>Name</th>
                                <th>Price</th>
                                <th>24h %</th>
                                <th>7d %</th>
                                <th>Market Cap</th>
                                <th>Volume (24h)</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {cryptoData.map((coin) => (
                                <tr key={coin.id}>
                                    <td>{coin.name}</td>
                                    <td>
                                        ${coin.quote.USD.price.toLocaleString()}
                                    </td>
                                    <td
                                        className={
                                            coin.quote.USD.percent_change_24h >
                                            0
                                                ? "price-up"
                                                : "price-down"
                                        }>
                                        {coin.quote.USD.percent_change_24h.toFixed(
                                            2
                                        )}
                                        %
                                    </td>
                                    <td
                                        className={
                                            coin.quote.USD.percent_change_7d > 0
                                                ? "price-up"
                                                : "price-down"
                                        }>
                                        {coin.quote.USD.percent_change_7d.toFixed(
                                            2
                                        )}
                                        %
                                    </td>
                                    <td>
                                        $
                                        {coin.quote.USD.market_cap.toLocaleString()}
                                    </td>
                                    <td>
                                        $
                                        {coin.quote.USD.volume_24h.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Cryptotable;
