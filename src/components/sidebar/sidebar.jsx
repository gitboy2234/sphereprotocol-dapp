import React, { useEffect, useState } from "react";
import "./sidebar.css";
import Dashboard from "../../pages/dashboard/dashboard";
import axios from "axios";

function Sidebar() {
    const [trending, setTrending] = useState([]);

    // Function to fetch trending coins
    const fetchTrendingCoins = () => {
        axios
            .get(
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
            )
            .then((response) => {
                const btcPriceInUSD = response.data.bitcoin.usd;
                axios
                    .get("http://188.166.229.235:3001/api/trending")
                    .then((response) => {
                        const updatedCoins = response.data.coins.map((coin) => {
                            coin.priceInUSD =
                                coin.item.price_btc * btcPriceInUSD;
                            return coin;
                        });
                        setTrending(updatedCoins);
                    })
                    .catch((error) =>
                        console.error("Error fetching trending coins:", error)
                    );
            })
            .catch((error) =>
                console.error("Error fetching BTC price:", error)
            );
    };

    // Fetch and auto-update trending coins every minute
    useEffect(() => {
        fetchTrendingCoins();
        const interval = setInterval(() => {
            fetchTrendingCoins();
        }, 30000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Handling sidebar UI
    useEffect(() => {
        const menuBtn = document.querySelector("#menu-btn");
        const closeBtn = document.querySelector("#close-btn");
        const sidebar = document.querySelector("aside");

        const handleResize = () => {
            if (window.innerWidth > 1024) {
                sidebar.style.display = "";
            }
        };

        if (menuBtn && closeBtn && sidebar) {
            menuBtn.addEventListener("click", () => {
                sidebar.style.display = "block";
            });

            closeBtn.addEventListener("click", () => {
                sidebar.style.display = "none";
            });

            window.addEventListener("resize", handleResize);
        }

        return () => {
            if (menuBtn && closeBtn) {
                menuBtn.removeEventListener("click", () => {
                    sidebar.style.display = "block";
                });

                closeBtn.removeEventListener("click", () => {
                    sidebar.style.display = "none";
                });
            }
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            <main>
                <aside>
                    <button id="close-btn">
                        <span className="material-symbols-sharp">close</span>
                    </button>
                    <div className="sidebar">
                        {/* Sidebar links */}
                        <a href="/dashboard" className="active">
                            <span className="material-symbols-sharp">
                                dashboard
                            </span>
                            <h4>Dashboard</h4>
                        </a>
                        <a href="/exchange">
                            <span className="material-symbols-sharp">
                                currency_exchange
                            </span>
                            <h4>Exchange</h4>
                        </a>
                        <a href="/wallet">
                            <span className="material-symbols-sharp">
                                account_balance_wallet
                            </span>
                            <h4>Wallet</h4>
                        </a>
                    </div>
                </aside>
                <Dashboard />
                <section className="right">
                    <div className="investments">
                        <div className="header">
                            <h2>Coin Trending</h2>
                        </div>
                        {trending.map((coin, index) => (
                            <div className="investment" key={index}>
                                <img
                                    src={coin.item.small}
                                    alt={coin.item.name}
                                />
                                <h4>{coin.item.name}</h4>
                                <div className="bonds">
                                    <p>{coin.item.symbol}</p>
                                    <small className="text-muted">Symbol</small>
                                </div>
                                <div className="amount">
                                    <p>${coin.priceInUSD.toFixed(8)}</p>
                                    <small className="danger"></small>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Sidebar;
