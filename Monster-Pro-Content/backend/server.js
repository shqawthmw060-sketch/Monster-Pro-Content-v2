const express = require("express");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const status = require("./routes/status");

require("dotenv").config();
require("./config/initDatabase");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================
// Routes
// ==========================

const dashboard = require("./routes/dashboard");
const channels = require("./routes/channels");
const importer = require("./routes/import");

// ==========================
// Middlewares
// ==========================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use("/api/status", status);

// ==========================
// Static Files
// ==========================

app.use(express.static(path.join(__dirname, "../frontend")));

// ==========================
// Home
// ==========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ==========================
// APIs
// ==========================

app.use("/api/dashboard", dashboard);
app.use("/api/channels", channels);
app.use("/api/import", importer);

// ==========================
// 404
// ==========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Not Found"
    });
});

// ==========================
// Start Server
// ==========================

app.listen(PORT, () => {

    console.log("==================================");
    console.log("🚀 Monster Pro IPTV Server");
    console.log("==================================");
    console.log(`🌍 http://localhost:${PORT}`);
    console.log("==================================");

});