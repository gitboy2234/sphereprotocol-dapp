import React, { useState } from "react";
import "./navbar.css";
import logo from "../images/logo.png";
import SidebarSolo from "../sidebar/sidebarsolo";

function NavbarSolo() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div>
            <nav>
                <div className="container">
                    <div className="flex">
                        <img src={logo} alt="" className="logo" />
                        <span className="font">SPHERE</span>
                    </div>

                    <div className="profile-area">
                        <button
                            id="menu-btn"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden ...">
                            <span className="material-symbols-sharp">menu</span>
                        </button>
                    </div>
                </div>
            </nav>
            <SidebarSolo
                isOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
        </div>
    );
}
export default NavbarSolo;
