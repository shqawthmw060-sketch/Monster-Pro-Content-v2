const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const db = require("../config/database");
const axios = require("axios");
const upload = multer({
    dest: "uploads/"
});

router.post("/file", upload.single("playlist"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }

    const content = fs.readFileSync(req.file.path, "utf8");

    const lines = content.split(/\r?\n/);

    let current = null;

    let imported = 0;
    let duplicates = 0;

    const insert = db.prepare(`
        INSERT INTO channels
        (name,tvg_id,tvg_logo,group_title,country,language,stream_url)
        VALUES(?,?,?,?,?,?,?)
    `);

    const find = db.prepare(`
        SELECT id FROM channels
        WHERE stream_url = ?
    `);

    for (const line of lines) {

        if (line.startsWith("#EXTINF")) {

            current = {
                name: line.split(",").pop().trim(),
                tvg_id: (line.match(/tvg-id="(.*?)"/) || ["",""])[1],
                tvg_logo: (line.match(/tvg-logo="(.*?)"/) || ["",""])[1],
                group_title: (line.match(/group-title="(.*?)"/) || ["",""])[1],
                country: "",
                language: ""
            };

        } else if (current && line.startsWith("http")) {

            const url = line.trim();

            const exists = find.get(url);

            if (exists) {

                duplicates++;

            } else {

                insert.run(
                    current.name,
                    current.tvg_id,
                    current.tvg_logo,
                    current.group_title,
                    current.country,
                    current.language,
                    url
                );

                imported++;

            }

            current = null;
        }
    }

    fs.unlinkSync(req.file.path);

    res.json({
        success: true,
        imported,
        duplicates
    });

});

router.post("/url", async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        const response = await axios.get(url, {
            timeout: 30000
        });

        const lines = response.data.split(/\r?\n/);

        let current = null;

        let imported = 0;
        let duplicates = 0;

        const insert = db.prepare(`
            INSERT INTO channels
            (name,tvg_id,tvg_logo,group_title,country,language,stream_url)
            VALUES(?,?,?,?,?,?,?)
        `);

        const find = db.prepare(`
            SELECT id FROM channels
            WHERE stream_url=?
        `);

        for (const line of lines) {

            if (line.startsWith("#EXTINF")) {

                current = {

                    name: line.split(",").pop().trim(),

                    tvg_id: (line.match(/tvg-id="(.*?)"/) || ["",""])[1],

                    tvg_logo: (line.match(/tvg-logo="(.*?)"/) || ["",""])[1],

                    group_title: (line.match(/group-title="(.*?)"/) || ["",""])[1],

                    country: "",

                    language: ""

                };

            }

            else if (current && line.startsWith("http")) {

                const stream = line.trim();

                const exists = find.get(stream);

                if (exists) {

                    duplicates++;

                }

                else {

                    insert.run(

                        current.name,

                        current.tvg_id,

                        current.tvg_logo,

                        current.group_title,

                        current.country,

                        current.language,

                        stream

                    );

                    imported++;

                }

                current = null;

            }

        }

        res.json({

            success: true,

            imported,

            duplicates

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});
module.exports = router;