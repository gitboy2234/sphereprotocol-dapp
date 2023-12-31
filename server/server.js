const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: "http://localhost:3000", // or your specific origin
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
