const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../config/database");

router.get("/", async (req, res) => {

    const channels = db.prepare(`
        SELECT id,name,stream_url
        FROM channels
    `).all();

    const result = [];

    for (const ch of channels) {

        let status = "offline";
        let time = 0;

        const start = Date.now();

        try {

            await axios.get(ch.stream_url, {
                timeout: 5000,
                responseType: "stream",
                validateStatus: () => true
            });

            time = Date.now() - start;

            if (time < 1000)
                status = "online";
            else
                status = "slow";

        } catch (e) {

            status = "offline";

        }

        result.push({
            id: ch.id,
            name: ch.name,
            status,
            response: time
        });

    }

    res.json(result);

});

module.exports = router;