const router =
require("express").Router();


const controller =
require("../controllers/dashboardController");



router.get(
"/",
controller.getDashboard
);



module.exports = router;
