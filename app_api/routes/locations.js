let express = require("express");
let router = express.Router();
let ctrlocations = require("../controllers/locations");

router.get("/api/locations", ctrlocations.locationsListByDistance);
router.get("/api/location/:locationid", ctrlocations.locationReadOne)
router.post("/api/location", ctrlocations.locationCreate);
router.put("/api/location/:locationid", ctrlocations.locationUpdateOne);
router.delete("/api/location/:locationid", ctrlocations.locationDeleteOne);
router.get("/api/locations/:locationid/reviews/:reviewid", ctrlocations.reviewReadOne);
router.post("/api/location/:locationid/reviews", ctrlocations.reviewCreate);
router.put("/api/location/:locationid/reviews/:reviewid", ctrlocations.reviewUpdateOne);
router.delete("/api/location/:locationid/reviews/:reviewid", ctrlocations.reviewDeleteOne);

module.exports = router;