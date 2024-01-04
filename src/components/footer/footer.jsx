import React from "react";
import { FaTwitter } from "react-icons/fa"; // Ensure this is the correct import for the Twitter icon
import { FaTelegram } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";

function Footer() {
    return (
        <div className="flex flex-col justify-center items-center h-32 text-white text-center">
            <div className="flex justify-center items-center h-24 space-x-7">
                <a
                    href="https://t.me/Sphereprotocol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 text-4xl">
                    <FaTelegram />
                </a>
                <a
                    href="http://twitter.com/spherebsc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 text-4xl">
                    <FaTwitter />
                </a>
                <a
                    href="https://sphereprotocol.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 text-4xl">
                    <BsGlobe />
                </a>
            </div>
            <div className="mt-2">
                ©2024 Sphere Protocol | All Rights Reserved
            </div>
        </div>
    );
}

export default Footer;
