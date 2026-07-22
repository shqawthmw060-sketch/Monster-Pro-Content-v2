const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


// Middleware

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));


// Frontend

app.use(
    express.static(
        path.join(__dirname,"../frontend")
    )
);


// Routes

const dashboardRoutes =
require("./routes/dashboard");


const channelsRoutes =
require("./routes/channels");



app.use(
    "/api/dashboard",
    dashboardRoutes
);


app.use(
    "/api/channels",
    channelsRoutes
);



// Home

app.get("/",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});



// Error Handler

app.use((err,req,res,next)=>{

    console.log(err);

    res.status(500).json({

        success:false,

        message:"Server Error"

    });

});



// Start Server

const PORT = 3000;


app.listen(PORT,()=>{

    console.log(
        `
🔥 Monster Pro IPTV v2 Server Started

🌐 http://localhost:${PORT}

🚀 API Ready

        `
    );

});
