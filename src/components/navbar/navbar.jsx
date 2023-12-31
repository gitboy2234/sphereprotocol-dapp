// Navbar.js
import React, { useState, useEffect } from "react";
import "./navbar.css";
import logo from "../images/logo.png";
import Sidebar from "../sidebar/sidebar";

function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        document.body.className = isDarkTheme ? "dark-theme" : "";
    }, [isDarkTheme]);

    return (
        <div>
            <nav>
                <div className="container">
                    <div className="flex">
                        <img src={logo} alt="" className="logo" />
                        <span className="font">SPHERE</span>
                    </div>
                    <div className="search-bar">
                        <span className="material-symbols-sharp">search</span>
                        <input type="search" placeholder="Search" />
                    </div>
                    <div className="profile-area">
                        <div
                            className="theme-btn"
                            onClick={() => setIsDarkTheme((prev) => !prev)}>
                            <span className="material-symbols-sharp active">
                                light_mode
                            </span>
                            <span className="material-symbols-sharp">
                                dark_mode
                            </span>
                        </div>

                        <button
                            id="menu-btn"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden ...">
                            <span className="material-symbols-sharp">menu</span>
                        </button>
                    </div>
                </div>
            </nav>
            <Sidebar
                isOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
        </div>
    );
}

export default Navbar;
