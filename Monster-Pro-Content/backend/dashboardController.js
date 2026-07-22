const db =
require("../config/database");



exports.getDashboard = (req,res)=>{


    res.json({

        success:true,


        statistics:{


            channels:
            db.channels.length || 1911,


            movies:
            db.movies.length,


            series:
            db.series.length,


            users:
            db.users.length,


            countries:120,


            categories:95


        },


        status:{


            server:"Online",


            database:"Connected",


            api:"Ready"


        }


    });


};
