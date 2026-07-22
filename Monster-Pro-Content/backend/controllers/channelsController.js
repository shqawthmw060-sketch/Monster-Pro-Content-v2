const db =
require("../config/database");



// GET Channels

exports.getChannels=(req,res)=>{


    let channels =
    db.channels;



    res.json({

        success:true,

        total:channels.length,

        data:channels


    });


};




// Add Channel

exports.addChannel=(req,res)=>{


    const channel=req.body;


    db.channels.push(channel);



    res.json({

        success:true,

        message:"Channel Added",

        channel

    });


};




// Delete Channel

exports.deleteChannel=(req,res)=>{


    const id=req.params.id;


    db.channels.splice(id,1);



    res.json({

        success:true,

        message:"Deleted"

    });


};
