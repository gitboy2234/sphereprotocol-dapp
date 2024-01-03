import React, { useEffect } from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";
import Scanner from "../../pages/scanner/scanner";
function SidebarSolo() {
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
                        <Link className="active" to="/dashboard">
                            <span className="material-symbols-sharp">
                                dashboard
                            </span>
                            <h4>Dashboard</h4>
                        </Link>
                        <a href="/exchange">
                            <span className="material-symbols-sharp">
                                currency_exchange
                            </span>
                            <h4>DEX Limit</h4>
                        </a>
                        <a href="/wallet">
                            <span className="material-symbols-outlined">
                                swap_horizontal_circle
                            </span>
                            <h4>Swap</h4>
                        </a>
                        <a href="/rugcheker">
                            <span class="material-symbols-outlined">
                                search_check
                            </span>
                            <h4>Rug checker</h4>
                        </a>
                        <a href="/wallet">
                            <span className="material-symbols-sharp">
                                account_balance_wallet
                            </span>
                            <h4>Wallet</h4>
                        </a>
                        <a href="/wallet">
                            <span class="material-symbols-outlined">lock</span>
                            <h4>Locker</h4>
                        </a>
                    </div>
                </aside>
                <Scanner />
            </main>
        </div>
    );
}

export default SidebarSolo;
