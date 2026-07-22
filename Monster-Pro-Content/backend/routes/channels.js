const router =
require("express").Router();


const controller =
require("../controllers/channelsController");



router.get(
"/",
controller.getChannels
);



router.post(
"/",
controller.addChannel
);



router.delete(
"/:id",
controller.deleteChannel
);



module.exports = router;
