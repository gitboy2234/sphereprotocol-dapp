import React, { useState, useEffect } from "react";
import "./navbar.css";
import logo from "../images/logo.png";
import SidebarSolo from "../sidebar/sidebarsolo";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import makeBlockie from "ethereum-blockies-base64";
function NavbarSolo() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const formatAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(
            address.length - 6
        )}`;
    };
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState("");
    const [userData, setUserData] = useState(null);
    const [blockieImage, setBlockieImage] = useState("");
    const handleConnectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(accounts[0]);
                setIsConnected(true);
                setBlockieImage(makeBlockie(accounts[0])); // Generate blockie
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("MetaMask is not installed!");
        }
    };

    const fetchUserData = async (address) => {
        try {
            const response = await axios.get(
                `[Your Backend URL]/api/path?address=${address}`
            );
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        // Check if wallet is already connected
        const checkIfWalletIsConnected = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                    setBlockieImage(makeBlockie(accounts[0])); // Regenerate blockie
                    localStorage.setItem("ethAddress", accounts[0]); // Store address in localStorage
                } else {
                    // Check localStorage
                    const storedAddress = localStorage.getItem("ethAddress");
                    if (storedAddress) {
                        setAccount(storedAddress);
                        setIsConnected(true); // Optionally, you can set this to false to require manual reconnection
                        setBlockieImage(makeBlockie(storedAddress)); // Regenerate blockie from stored address
                    }
                }
            }
        };

        checkIfWalletIsConnected();

        // Listen for account changes
        window.ethereum?.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsConnected(true);
                setBlockieImage(makeBlockie(accounts[0]));
                localStorage.setItem("ethAddress", accounts[0]);
            } else {
                setIsConnected(false);
                localStorage.removeItem("ethAddress"); // Clear stored address
            }
        });
    }, []);
    return (
        <div>
            <nav>
                <div className=" bg-black bg-opacity-0 main-font relative">
                    <Grid container spacing={1}>
                        <Grid xs={2}>
                            <div className="flex justify-center space-x-3 my-1">
                                <div className="h-12 w-12 ">
                                    <img src={logo} alt="logo" />
                                </div>
                                <div>
                                    <p className=" text-white pt-2 text-2xl">
                                        SPHERE
                                    </p>
                                </div>
                            </div>
                        </Grid>
                        <Grid xs={10}>
                            <div className=" text-white flex justify-between mx-5">
                                <div>
                                    <ul className="flex space-x-5 text-xl pt-4 justify-start ">
                                        <li className=" cursor-pointer">
                                            <Link to="/main">Discover</Link>
                                        </li>
                                        <li className=" cursor-pointer">
                                            My Locker
                                        </li>
                                    </ul>
                                </div>
                                {!isConnected ? (
                                    <div className="p-2">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleConnectWallet}>
                                            Connect Wallet
                                        </Button>
                                    </div>
                                ) : (
                                    <ul className="flex space-x-5 text-xl pt-3 justify-end ">
                                        <li>
                                            <Link to="/locker">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className="main-font">
                                                    LOCK TOKEN
                                                </Button>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/unlocker">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className="main-font">
                                                    Unlock Token
                                                </Button>
                                            </Link>
                                        </li>
                                        <li className=" text-sm border-1 rounded-md  bg-gray-700 border-gray-200">
                                            <div className="flex space-x-2 mx-3 my-1 ">
                                                <div>
                                                    <img
                                                        src={blockieImage}
                                                        alt="emptylogo"
                                                        className="h-7 w-7 rounded-full"
                                                    />
                                                </div>
                                                <span className=" mt-1  shadow-2xl">
                                                    {formatAddress(account)}
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </div>

                <div className="profile-area">
                    <button
                        id="menu-btn"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden ...">
                        <span className="material-symbols-sharp">menu</span>
                    </button>
                </div>

                <SidebarSolo
                    isOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </nav>
        </div>
    );
}
export default NavbarSolo;
