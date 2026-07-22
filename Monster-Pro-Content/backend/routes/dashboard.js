const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/", (req, res) => {

    const channels = db.prepare("SELECT COUNT(*) AS total FROM channels").get().total;
    const movies = db.prepare("SELECT COUNT(*) AS total FROM movies").get().total;
    const series = db.prepare("SELECT COUNT(*) AS total FROM series").get().total;

    const countries = db.prepare(`
        SELECT COUNT(DISTINCT group_title) AS total
        FROM channels
    `).get().total;

    res.json({
        channels,
        movies,
        series,
        countries
    });

});

module.exports = router;