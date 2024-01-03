import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./scanner.css";
import BigInt from "bignumber.js";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TbDiscountCheckFilled, TbAlertOctagonFilled } from "react-icons/tb";
import CircularProgress from "@mui/material/CircularProgress";

function Scanner() {
    const [contractAddress, setContractAddress] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");
    const [contractAnalysis, setContractAnalysis] = useState([]);
    const [honeypotAnalysis, setHoneypotAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [network, setNetwork] = useState("BSC");
    const [web3, setWeb3] = useState(null);
    const [tokenDetails, setTokenDetails] = useState(null);
    const [hasInput, setHasInput] = useState(false);

    const [hasScanned, setHasScanned] = useState(false);

    useEffect(() => {
        let provider;
        if (network === "Ethereum") {
            provider =
                "https://mainnet.infura.io/v3/e869620b99334119bba095c34ccb8558";
        } else {
            provider =
                "https://skilled-aged-replica.bsc.quiknode.pro/fa781ac0e208b4f43499a55709c6af36b7784544/";
        }
        setWeb3(new Web3(provider));
    }, [network]);

    const getApiEndpoint = (network, contractAddress, type) => {
        const apiKey =
            network === "Ethereum"
                ? "FUMHTQE96FPWIW79ZJFCIXFX5BPCGNQC7T"
                : "JUDPV627WC6YPRF9PJ992PQ4MMAIZVCDVV";
        const baseUrl =
            network === "Ethereum"
                ? "https://api.etherscan.io/api"
                : "https://api.bscscan.com/api";

        switch (type) {
            case "abi":
                return `${baseUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
            case "tx":
                return `${baseUrl}?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
            case "source":
                return `${baseUrl}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
            default:
                return "";
        }
    };

    const scanContract = async () => {
        setIsLoading(true);
        setHasScanned(true);
        if (!contractAddress) {
            alert("Please enter a contract address.");
            setIsLoading(false);
            return;
        }
        const tokenSecurityData = await fetchTokenSecurityData(
            contractAddress,
            network
        );

        if (tokenSecurityData) {
        }

        const abiUrl = getApiEndpoint(network, contractAddress, "abi");
        const txUrl = getApiEndpoint(network, contractAddress, "tx");
        const sourceUrl = getApiEndpoint(network, contractAddress, "source");

        try {
            const abiResponse = await fetch(abiUrl);
            const abiData = await abiResponse.json();

            if (abiData.status !== "1") {
                setVerificationStatus("NOT A VALID CONTRACT");
                setContractAnalysis([]);
                setIsLoading(false);
                setHoneypotAnalysis(null);
                return;
            }

            setVerificationStatus("This contract is verified.");
            const ABI = JSON.parse(abiData.result);
            const contract = new web3.eth.Contract(ABI, contractAddress);

            const txResponse = await fetch(txUrl);
            const txData = await txResponse.json();
            const creatorAddress = txData.result[0].from;

            const sourceResponse = await fetch(sourceUrl);
            const sourceData = await sourceResponse.json();

            let analysisLines = [];

            if (sourceData.status === "1" && sourceData.result.length > 0) {
                const sourceCode = sourceData.result[0].SourceCode;

                const creatorBalance = new BigInt(
                    await contract.methods.balanceOf(creatorAddress).call()
                );
                const totalSupply = new BigInt(
                    await contract.methods.totalSupply().call()
                );
                const creatorPercentage =
                    (creatorBalance * new BigInt(100)) / totalSupply;

                analysisLines.push({
                    text: "Contract Analysis Report:",
                    className: "font-title",
                });

                if (sourceCode.includes("transferOwnership")) {
                    analysisLines.push({
                        text: "Contract has 'transferOwnership' function.",
                        className: "text-orange-800 font-margin",
                    });
                    analysisLines.push({
                        text: "🔍 This function allows the contract owner to transfer ownership, potentially to a dead address to renounce control. ",
                        className: "font-margin",
                    });
                } else {
                    analysisLines.push({
                        text: " No 'transferOwnership' function found.",
                        className: "font-margin",
                    });
                    analysisLines.push({
                        text: "✅ The absence of this function means ownership cannot be easily transferred or renounced.",
                        className: "font-margin",
                    });
                }

                const hasTaxFunctions =
                    sourceCode.includes("setBuyTax") ||
                    sourceCode.includes("setSellTax");

                if (hasTaxFunctions) {
                    analysisLines.push({
                        text: "🔍 The contract includes functions for adjusting buy/sell taxes.",
                        className: "text-sm text-white font-margin",
                    });
                } else {
                    analysisLines.push({
                        text: "✅ The contract does not have functions to modify buy/sell taxes. ",
                        className: "text-sm text-white font-margin",
                    });
                }

                // First, add the basic information with dynamic coloring based on the percentage

                if (creatorPercentage > 5) {
                    analysisLines.push({
                        text: "⚠️ The creator holds more than 5% of the total token supply, which indicates a higher level of control over the token's market.",
                        className: "font-margin",
                    });
                } else {
                    analysisLines.push({
                        text: "✅ Ownership is decentralized – the creator possesses less than 5% of the total token supply.",
                        className: "font-margin",
                    });
                }
            } else {
                setContractAnalysis([
                    "Unable to fetch or analyze contract source code.",
                ]);
                setIsLoading(false);
                setHasScanned(true);
                return;
            }

            try {
                const isPaused = await contract.methods.paused().call();
                analysisLines.push({
                    text: `❌ Contract is ${
                        isPaused
                            ? "paused the trading on this pair"
                            : "not paused but it can be paused"
                    }.`,
                    className: isPaused ? "text-red-500" : "text-green-500",
                });
                analysisLines.push({
                    text: "⚠️ Please be carefull, this contract does  contain functions that could unexpectedly halt your transactions. Your trading activities can be interrupted.",
                    className: "font-margin",
                });
            } catch (error) {
                analysisLines.push({
                    text: " ✅ No Pausable Function",
                    className: "font-margin",
                });
                analysisLines.push({
                    text: "✅ Rest assured, this contract does not contain functions that could unexpectedly halt your transactions. Your trading activities remain uninterrupted.",
                    className: "font-margin",
                });
            }

            setContractAnalysis(analysisLines);
        } catch (error) {
            console.error("Error in scanning contract:", error);
            setVerificationStatus("Error during scanning.");
            setContractAnalysis(["Error during source code analysis."]);
            setHoneypotAnalysis(null);
        } finally {
            setIsLoading(false);
        }

        await checkHoneypot();
    };
    // const truncateAddress = (address) => {
    //     return `${address.substring(0, 6)}...${address.substring(
    //         address.length - 4
    //     )}`;
    // };

    // const formatBalance = (balance) => {
    //     return parseInt(balance).toLocaleString(); // Converts to a whole number and formats with commas
    // };

    // const formatPercentage = (percent) => {
    //     return (parseFloat(percent) * 100).toFixed(2); // Converts to a percentage and fixes to 2 decimal places
    // };
    const formatAddress = (address) => {
        return window.innerWidth < 640
            ? address.slice(0, 30) + "<br />" + address.slice(15)
            : address;
    };
    const handleInputChange = (e) => {
        setContractAddress(e.target.value);
        if (e.target.value.trim() !== "") {
            setHasInput(true);
        }
    };

    const fetchTokenSecurityData = async (contractAddress, network) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3001/token-security?network=${network}&contractAddresses=${contractAddress}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (!data.result || !data.result[contractAddress.toLowerCase()]) {
                setTokenDetails(null);
                return null;
            }
            setTokenDetails(data.result[contractAddress.toLowerCase()]);
            return data.result[contractAddress.toLowerCase()].holders;
        } catch (error) {
            console.error("Error fetching token security data:", error);
            setError(
                error.message || "An error occurred while fetching token data."
            );
            setTokenDetails(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const checkHoneypot = async () => {
        setIsLoading(true);
        const honeypotUrl = `https://api.honeypot.is/v2/IsHoneypot?address=${contractAddress}`;

        try {
            const response = await fetch(honeypotUrl);
            const data = await response.json();

            if (data && data.honeypotResult) {
                setHoneypotAnalysis(data);
            } else {
                const fallbackAnalysis = {
                    unknownStatus: true,
                    reason:
                        data.simulationError ||
                        "Could not determine the status.",
                };
                setHoneypotAnalysis(fallbackAnalysis);
                console.error("Fallback honeypot analysis:", fallbackAnalysis);
            }
        } catch (error) {
            console.error("Error fetching honeypot data:", error);
            setHoneypotAnalysis(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="font-global">
            <div className="relative mt-10 px-2 w-full ">
                <div className="h-3/4 border-2 div-box rounded-xl mx-auto sm:w-full md:w-3/4 lg:w-1/2 lg:ml-[300px] xl:ml-[310px] 2xl:ml-[480px] py-5 shadow-2xl ">
                    <div className="mx-5 my-5 sm:shadow-2xl md:shadow-none">
                        <Box
                            className="md:flex "
                            sx={{
                                alignItems: "flex-end",
                                width: "full",
                            }}>
                            <div className=" md:my-0 sm:flex sm:justify-center sub-font mx-2 ">
                                <select
                                    className="rounded-lg  sm:w-[70px]   md:w-[110px]  mb-4 "
                                    value={network}
                                    onChange={(e) =>
                                        setNetwork(e.target.value)
                                    }>
                                    <option value="BSC">BSC</option>
                                    <option value="Ethereum">ETH</option>
                                </select>
                            </div>
                            <div className="flex w-full ">
                                <TextField
                                    variant="filled"
                                    color="success"
                                    id="contract-address-input"
                                    fullWidth
                                    value={contractAddress}
                                    onChange={handleInputChange}
                                    sx={{
                                        // Set the input field's background color to transparent if there is text
                                        backgroundColor:
                                            contractAddress.length > 0
                                                ? "transparent"
                                                : "",
                                        "& .MuiFilledInput-root": {
                                            // Ensure the background is transparent even before and after being focused
                                            backgroundColor: "transparent",
                                            "&:before": {
                                                // Border color when not focused
                                                borderBottomColor:
                                                    contractAddress.length > 0
                                                        ? "white"
                                                        : "",
                                            },
                                            "&:after": {
                                                // Border color when focused
                                                borderBottomColor: "white",
                                            },
                                            "&:hover:before": {
                                                // Border color on hover
                                                borderBottomColor:
                                                    contractAddress.length > 0
                                                        ? "transparent"
                                                        : "",
                                            },
                                        },
                                        input: {
                                            color: "white",
                                            fontSize: "20px",
                                            fontFamily:
                                                '"Press Start 2P", sans-serif',
                                        },
                                    }}
                                />

                                <Button
                                    onClick={scanContract}
                                    variant="contained"
                                    style={{
                                        backgroundColor: "#00D084",
                                    }}>
                                    SCAN
                                </Button>
                            </div>
                        </Box>
                    </div>
                </div>
            </div>
            {tokenDetails ? (
                <div></div>
            ) : hasInput ? (
                <div className=" text-center text-4xl my-5">
                    <span>⚠️ </span>{" "}
                    <span>PLEASE CHECK THE ADDRESS/NETWORK</span>
                </div>
            ) : (
                <div className=" text-center text-4xl my-5">
                    <p> PLEASE INPUT ADDRESS AND PICK CORRECT NETWORK</p>
                </div>
            )}
            {hasScanned ? (
                <div className="md:grid md:grid-cols-2 sm:grid-cols-1 2xl:mx-[300px]  my-[20px]">
                    <div className="mx-auto ">
                        {isLoading ? (
                            <div className="flex justify-center items-center mt-5">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div>
                                {error && (
                                    <p className="error-message">{error}</p>
                                )}
                                {tokenDetails ? (
                                    <div className="mx-3 mt-[40px] div-box px-5 py-5 rounded-md bg-opacity-40 tracking-widest  shadow-2xl">
                                        {contractAnalysis.map((line, index) => (
                                            <p
                                                key={index}
                                                className={line.className}>
                                                {line.text}
                                            </p>
                                        ))}

                                        {tokenDetails.is_mintable === 1 ? (
                                            <p className="font-margin">
                                                ❌ This contract includes a mint
                                                function.
                                            </p>
                                        ) : (
                                            <p className="font-margin ">
                                                ✅ This Contract has no mint
                                                function.
                                            </p>
                                        )}

                                        {tokenDetails.can_take_back_ownership ===
                                        1 ? (
                                            <p className="font-margin">
                                                ❌ The ability to reclaim
                                                ownership has been detected in
                                                this contract.
                                            </p>
                                        ) : (
                                            <p className="font-margin">
                                                ✅ No feature to reclaim
                                                ownership is present in this
                                                contract.
                                            </p>
                                        )}

                                        {tokenDetails.owner_change_balance ===
                                        1 ? (
                                            <p className="font-margin">
                                                ❌ The contract allows the owner
                                                to change token holder balances.
                                            </p>
                                        ) : (
                                            <p className="font-margin">
                                                ✅ The contract does not permit
                                                the owner to change token holder
                                                balances.
                                            </p>
                                        )}

                                        {tokenDetails.hidden_owner === 1 ? (
                                            <p className="font-margin">
                                                ❌ The contract has hidden
                                                owners.
                                            </p>
                                        ) : (
                                            <p className="font-margin">
                                                ✅ The contract does not have
                                                hidden owners.
                                            </p>
                                        )}

                                        {tokenDetails.selfdestruct === 1 ? (
                                            <p className="font-margin">
                                                ❌ The contract has a
                                                self-destruct function. This is
                                                a critical red flag, as it means
                                                the contract can be destroyed,
                                                rendering all of its functions
                                                unavailable and potentially
                                                erasing all related assets.
                                            </p>
                                        ) : (
                                            <p className="font-margin">
                                                ✅ The contract does not have a
                                                self-destruct function.
                                            </p>
                                        )}

                                        {tokenDetails.is_anti_whale === "1" ? (
                                            <p className="font-margin">
                                                ✅ The contract includes an
                                                anti-whale mechanism.
                                            </p>
                                        ) : (
                                            <p className="font-margin">
                                                ❌ There is no anti-whale
                                                mechanism in this contract.
                                            </p>
                                        )}

                                        {tokenDetails.transfer_pausable ===
                                        "1" ? (
                                            <p className="font-margin">
                                                ❌ This contract has the
                                                capability to pause trading.
                                            </p>
                                        ) : (
                                            <p className="font-margin">
                                                ✅ Trading cannot be paused in
                                                this contract.
                                            </p>
                                        )}

                                        {verificationStatus ===
                                        "This contract is verified." ? (
                                            <p className="font-margin">
                                                ✅ This Contract is Verified.
                                            </p>
                                        ) : (
                                            <p className="font-margin">
                                                ❌ The contract has not been
                                                verified.
                                            </p>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <div className=" ">
                        {" "}
                        {isLoading ? (
                            <div className="flex justify-center items-center mt-5">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div className="grid md:grid-rows-2 sm:grid-rows-1 space-y-5 tracking-widest ">
                                {honeypotAnalysis ? (
                                    <div className="div-box bg-opacity-40 px-5 py-5 sm:mx-3 rounded-md  sm:mt-[20px] md:mt-[40px] shadow-2xl ">
                                        <>
                                            <div>
                                                <span className="text-yellow-500 text-2xl font-title">
                                                    IS THIS HONEYPOT:{" "}
                                                </span>
                                                <br />
                                                {honeypotAnalysis.honeypotResult ? (
                                                    honeypotAnalysis
                                                        .honeypotResult
                                                        .isHoneypot ? (
                                                        <div className="flex space-x-2 text-center ">
                                                            <span className="md:mt-0.5 text-red-600 sm:mt-3 animate-pulse">
                                                                <TbAlertOctagonFilled
                                                                    size={25}
                                                                />
                                                            </span>
                                                            <span className="font-margin">
                                                                YES! This token
                                                                is a honeypot,
                                                                Please don't buy
                                                                this token.
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex space-x-2 text-center">
                                                            <span className="md:mt-0.5 sm:mt-3 text-green-500 animate-pulse">
                                                                <TbDiscountCheckFilled
                                                                    size={25}
                                                                />
                                                            </span>
                                                            <span className="font-margin">
                                                                NO, you can
                                                                safely buy this
                                                                token, but be
                                                                careful as some
                                                                tokens can be
                                                                changed to
                                                                honeypots.
                                                            </span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <p>
                                                        Unable to determine
                                                        honeypot status.
                                                    </p>
                                                )}
                                            </div>
                                            <div className="">
                                                <p className="font-margin">
                                                    TOKEN BASIC ANALYSIS:
                                                </p>
                                                {honeypotAnalysis.token && (
                                                    <>
                                                        <div className="font-margin">
                                                            <span className="text-yellow-500">
                                                                TOKEN NAME:{" "}
                                                            </span>
                                                            <span>
                                                                {
                                                                    honeypotAnalysis
                                                                        .token
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                        {tokenDetails ? (
                                                            <div className=" flex font-margin">
                                                                <span className="text-yellow-500 my-auto">
                                                                    Token
                                                                    Symbol:{" "}
                                                                </span>
                                                                <span>$</span>
                                                                <span className=" ">
                                                                    {
                                                                        tokenDetails.token_symbol
                                                                    }
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                        <div className="font-margin">
                                                            <span className="text-yellow-500 ">
                                                                TOTAL HOLDERS:{" "}
                                                            </span>
                                                            <span>
                                                                {
                                                                    honeypotAnalysis
                                                                        .token
                                                                        .totalHolders
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="font-margin">
                                                            <span className="text-yellow-500">
                                                                Max Buy:{" "}
                                                            </span>
                                                            <span>
                                                                {honeypotAnalysis
                                                                    ?.simulationResult
                                                                    ?.maxBuy
                                                                    ?.token
                                                                    ? `${honeypotAnalysis.simulationResult.maxBuy.token} ${honeypotAnalysis.token.symbol}`
                                                                    : "NO BUY LIMIT"}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            {honeypotAnalysis.token ? (
                                                <div className="flex flex-col sm:flex-row font-margin">
                                                    <span className=" text-yellow-500 my-auto">
                                                        TOKEN ADDRESS:{" "}
                                                    </span>
                                                    <span
                                                        className=""
                                                        dangerouslySetInnerHTML={{
                                                            __html: formatAddress(
                                                                honeypotAnalysis
                                                                    .token
                                                                    .address
                                                            ),
                                                        }}></span>
                                                </div>
                                            ) : null}
                                            {tokenDetails ? (
                                                <div className=" flex font-margin">
                                                    <span className="text-yellow-500 my-auto">
                                                        Owner Address:{" "}
                                                    </span>

                                                    <span
                                                        className=""
                                                        dangerouslySetInnerHTML={{
                                                            __html: formatAddress(
                                                                tokenDetails.owner_address
                                                            ),
                                                        }}></span>
                                                </div>
                                            ) : null}
                                            {tokenDetails ? (
                                                <div className=" flex font-margin">
                                                    <span className="text-yellow-500 my-auto">
                                                        Creator Address:{" "}
                                                    </span>

                                                    <span
                                                        className=""
                                                        dangerouslySetInnerHTML={{
                                                            __html: formatAddress(
                                                                tokenDetails.creator_address
                                                            ),
                                                        }}></span>
                                                </div>
                                            ) : null}
                                            {tokenDetails ? (
                                                <p className="font-margin">
                                                    <span className="text-yellow-500">
                                                        {" "}
                                                        Total Supply:{" "}
                                                    </span>

                                                    {tokenDetails.total_supply}
                                                </p>
                                            ) : null}
                                            {honeypotAnalysis.simulationResult && (
                                                <>
                                                    <div className="font-margin">
                                                        <p
                                                            className={
                                                                honeypotAnalysis
                                                                    .simulationResult
                                                                    .buyTax > 15
                                                                    ? "text-red-500"
                                                                    : "text-green-500"
                                                            }>
                                                            Buy Tax:{" "}
                                                            {honeypotAnalysis.simulationResult.buyTax.toFixed(
                                                                2
                                                            )}
                                                            %
                                                        </p>
                                                    </div>
                                                    <div className="font-margin">
                                                        <p
                                                            className={
                                                                honeypotAnalysis
                                                                    .simulationResult
                                                                    .sellTax >
                                                                15
                                                                    ? "text-red-500"
                                                                    : "text-green-500"
                                                            }>
                                                            Sell Tax:{" "}
                                                            {honeypotAnalysis.simulationResult.sellTax.toFixed(
                                                                2
                                                            )}
                                                            %
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </>

                                        <div></div>
                                    </div>
                                ) : null}
                                {/* {tokenDetails && tokenDetails.holders && (
                                    <div className="div-box bg-opacity-40 px-5 py-5 sm:mx-3 rounded-md  mt-[40px] shadow-2xl ">
                                        <div className="bg-dark-600 text-black p-4 rounded-lg">
                                            <h2 className="text-xl font-bold mb-4 text-yellow-500">
                                                Top 10 Holders
                                            </h2>
                                            <div className="overflow-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-left text-yellow-500">
                                                                Address
                                                            </th>
                                                            <th className="text-left text-yellow-500">
                                                                Balance
                                                            </th>
                                                            <th className="text-left text-yellow-500">
                                                                Percent
                                                            </th>
                                                            <th className="text-left text-yellow-500">
                                                                Type
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {tokenDetails.holders
                                                            .slice(0, 10)
                                                            .map(
                                                                (
                                                                    holder,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <td className="truncate">
                                                                            {truncateAddress(
                                                                                holder.address
                                                                            )}
                                                                        </td>
                                                                        <td className="text-left">
                                                                            {formatBalance(
                                                                                holder.balance
                                                                            )}
                                                                        </td>
                                                                        <td className="text-left">{`${formatPercentage(
                                                                            holder.percent
                                                                        )}%`}</td>
                                                                        <td className="text-left">
                                                                            {holder.is_contract ===
                                                                                1 &&
                                                                            holder.is_locked ===
                                                                                1
                                                                                ? "LP"
                                                                                : holder.is_contract ===
                                                                                  1
                                                                                ? "Contract"
                                                                                : "Wallet"}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Scanner;
