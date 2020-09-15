let ctrlLocations = require("../controllers/locations");
let express = require("express");
let router = express.Router();

router.get("/", ctrlLocations.homeList);
router.get("/location/:locationid", ctrlLocations.locationInfo);
router.get("/location/:locationid/reviews/new", ctrlLocations.addReview);
router.post("/location/:locationid/reviews/new", ctrlLocations.doAddReview);

module.exports = router;