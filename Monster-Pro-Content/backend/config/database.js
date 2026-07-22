const path = require("path");


// مؤقتًا سنستخدم JSON Database
// وبعدها نربطه MySQL أو PostgreSQL


const database = {

    channels:[],

    movies:[],

    series:[],

    users:[],


    settings:{

        name:"Monster Pro IPTV",

        version:"v2"

    }

};



module.exports = database;
