const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: "https://dapp.sphereprotocol.com", // or your specific origin
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Enable CORS for the specified origin

app.get("/api/trending", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/search/trending"
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching trending coins:", error.message);
        res.status(500).send("Error fetching trending coins");
    }
});

const cache = {};

app.get("/api/top-coins", async (req, res) => {
    try {
        const params = {
            start: 1,
            limit: 10,
            convert: "USD",
        };
        const headers = {
            "X-CMC_PRO_API_KEY": "32a754d9-74d0-4999-8dde-687ab544f7b1",
        };
        const response = await axios.get(
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
            { params, headers }
        );
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
const getChainId = (network) => {
    const networkMap = {
        BSC: "56",
        Ethereum: "1",
    };
    return networkMap[network] || "56"; // Default to BSC if network not found
};

app.get("/token-security", async (req, res) => {
    const network = req.query.network;
    const chainId = getChainId(network);
    const contractAddresses = req.query.contractAddresses;

    if (!contractAddresses) {
        return res
            .status(400)
            .send("contractAddresses query parameter is required");
    }

    try {
        const goplusResponse = await fetch(
            `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${contractAddresses}`
        );

        // Check if the response from GoPlus API was not OK (e.g., 400, 500 status codes)
        if (!goplusResponse.ok) {
            const errorResponse = await goplusResponse.json();
            console.error("Error from GoPlus API:", errorResponse);
            return res.status(500).json({
                error: `Failed to fetch data from GoPlus API: ${errorResponse.message}`,
            });
        }

        // If the response was OK, proceed to send back the data
        const data = await goplusResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
