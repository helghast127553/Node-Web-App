let mongoose = require("mongoose");
let Loc = mongoose.model("Location");

let theEarth = (function() {
    let earthRadius = 6371;

    let getDistanceFromRads = function(rads) {
        return parseFloat(rads * earthRadius);
    };

    let getRadsFromDistance = function(distance){
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads,
        getRadsFromDistance
    };
})();

let setAverageRating = function(location) {
    let reviewCount = 0;
    let ratingAverage = 0;
    let ratingTotal = 0;

    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        for (let index = 0; index < reviewCount; index++) {
            ratingTotal += location.reviews[index].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log("Average rating updated to", ratingAverage);
            }
        });
    }
};

let updateAverageRating = function(locationid) {
    Loc.findById(locationid)
        .select("rating reviews")
        .exec(function(error, location) {
            if (!error) {
                setAverageRating(location);
            }
        });
};

let sendJsonResponse = function(response, status, content) {
    response.status(status);
    response.json(content);
};

let addReview = function(request, response, location) {
    if (!location) {
        sendJsonResponse(response, 404, { message: "locationid not found"});
    } else {
        location.reviews.push({
            author: request.body.author,
            rating: request.body.rating,
            reviewText: request.body.reviewText
        });
        location.save(function(error, location) {
            let review = null;
            if (error) {
                console.log(error);
                sendJsonResponse(response, 400, error);
            } else {
                updateAverageRating(location._id);
                review = location.reviews[location.reviews.length - 1];
                sendJsonResponse(response, 201, review);
            }
        });
    }
};

module.exports.locationsListByDistance = function(request, response) {
    // let lng = parseFloat(request.query.lng);
    // let lat = parseFloat(request.query.lat);

    // if (!lng || !lat) {
    //     sendJsonResponse(response, 404, {
    //         message: "lng and lat query parameters are required"
    //     });
    //     return;
    // }

    Loc.find(function(error, results) {
        if (results.length == 0) {
            sendJsonResponse(response, 404, { message: "locations not found" });
            return;
        } else if (error) {
            sendJsonResponse(response, 400, error);
            return;
        }
        let locations = [];
        results.forEach(function(doc) {
            locations.push({
                name: doc.name,
                address: doc.address,
                rating: doc.rating,
                facilities: doc.facilities,
                _id: doc._id
            });
        });
        sendJsonResponse(response, 200, locations);
    });

    // Loc.aggregate([
    //     {
    //         $geoNear: {
    //             near: {
    //                 type: "Point",
    //                 coordinates: [lng, lat]
    //             },
    //             spherical: true,
    //             maxDistance: theEarth.getRadsFromDistance(request.query.maxDistance),
    //             distanceField: "dist.calculated"
    //         }
    //     },
    //     { $limit: 10 }
    // ]).then(function(results) {
    //     if (results.length == 0) {
    //         sendJsonResponse(response, 404, { message: "locations not found" });
    //         return;
    //     }

    //     let locations = [];
    //     results.forEach(function(doc) {
    //         locations.push({
    //             distance: theEarth.getDistanceFromRads(doc.distance),
    //             name: doc.name,
    //             address: doc.address,
    //             rating: doc.rating,
    //             facilities: doc.facilities,
    //             _id: doc._id
    //         });
    //     });
    //     sendJsonResponse(response, 200, locations);
    // }).catch(function(error) {
    //     sendJsonResponse(response, 400, error);
    // });
};

module.exports.locationReadOne = function(request, response) {
    if (request.params && request.params.locationid) {
        Loc.findById(request.params.locationid)
            .exec(function(error, location) {
                if (!location) {
                    sendJsonResponse(response, 404, { message: "locationid not found" });
                    return;
                } else if (error) {
                    sendJsonResponse(response, 404, error);
                    return;
                }
                sendJsonResponse(response, 200, location);
            });
    } else {
        sendJsonResponse(response, 404, { message: "No locationid in request" });
    }
};

module.exports.locationCreate = function(request, response) {
    Loc.create({
        name: request.body.name,
        address: request.body.address,
        faclities: request.body.faclities.split(","),
        coords:[parseFloat(request.body.lng), parseFloat(request.body.lat)],
        openingTimes: [{
            days: request.body.days1,
            opening: request.body.opening1,
            closing: request.body.closing1,
            closed: request.body.closed1
        }, {
            days: request.body.days2,
            opening: request.body.opening2,
            closing: request.body.closing2,
            closed: request.body.closed2
        }]
    }, function(error, location) {
        if (error) {
            sendJsonResponse(response, 400, error);
        } else {
            sendJsonResponse(response, 201, location);
        }
    });
};

module.exports.locationUpdateOne = function(request, response) {
    if (!request.params.locationid) {
        sendJsonResponse(response, 404, { message: "Not found, locationid is required"});
        return;
    }
    Loc.findById(request.params.locationid)
        .select("-reviews -rating")
        .exec(function(error, location) {
            if (!location) {
                sendJsonResponse(response, 404, { message: "locationid not found" });
                return;
            } else if (error) {
                sendJsonResponse(response, 400, error);
                return;
            }
            location.name = request.body.name;
            location.address = request.body.address;
            location.facilities = request.body.facilities.splot(",");
            location.coords = [parseFloat(request.body.lng), parseFloat(request.body.lat)];
            location.openingTimes = [{
                days: request.body.days1,
                opening: request.body.opening1,
                closing: request.body.closing1,
                closed: request.body.closed1
            }, {
                days: request.body.days2,
                opening: request.body.opening2,
                closing: request.body.closing2,
                closed: request.body.closed2
            }];
            location.save(function(error, location) {
                if (error) {
                    sendJsonResponse(response, 404, error);
                } else {
                    sendJsonResponse(response, 200, location);
                }
            });
        });
};

module.exports.locationDeleteOne = function(request, response) {
    let locationid = request.params.locationid
    if (locationid) {
        Loc.findByIdAndRemove(locationid)
            .exec(function(error, location) {
                if (error) {
                    sendJsonResponse(response, 400, error);
                    return;
                } 
                sendJsonResponse(response, 204, null);
            });
    } else {
        sendJsonResponse(response, 404, { message: "No locationid" });
    }
};

module.exports.reviewReadOne = function(request, response) {
    if (request.params && request.params.reviewid) {
        Loc.findById(request.params.reviewid)
            .select("name reviews")
            .exec(function(error, location) {
                let response = null;
                let review = null;
                if (!location) {
                    sendJsonResponse(response, 404, { message: "locationid not found" });
                    return;
                } else if (error) {
                    sendJsonResponse(response, 400, error);
                }

                if (location.reviews && location.reviews.length > 0) {
                    review = location.reviews.id(request.params.reviewid);
                    if (!review) {
                        sendJsonResponse(response, 404, { message: "reviewid not found" });
                        return;
                    } else {
                        response = {
                            location: {
                                name: location.name,
                                id: request.params.locationid
                            },
                            review: review
                        };
                        sendJsonResponse(response, 200, response);
                    }
                } else {
                    sendJsonResponse(response, 404, { message: "No reviews found" });
                }
            })
    } else {
        sendJsonResponse(response, 404, { message: "Not found, locationid, and reviewid are both required" });
    }
};

module.exports.reviewCreate = function (request, response) {
    if (request.params.locationid) {
        Loc.findById(request.params.locationid)
            .select("reviews")
            .exec(function(error, location) {
                if (error) {
                    sendJsonResponse(response, 400, error);
                } else {
                    addReview(request, response, location);
                }
            })
    } else {
        sendJsonResponse(response, 404, { message: "Not found, locationid required" });
    }
};

module.exports.reviewUpdateOne = function(request, response) {
    if (!request,params.locationid || !request.params.reviewid) {
        sendJsonResponse(response, 404, { message: "Not found, locationid, and reviewid are both required" });
        return;
    }

    Loc.findById(request.params.locationid)
        .select("reviews")
        .exec(function(error, location) {
            let review = null;

            if (!location) {
                sendJsonResponse(response, 404, { message: "locationid not found"});
                return;
            } else if (error) {
                sendJsonResponse(response, 400, error);
                return;       
            } 
        
            if (location.reviews && location.reviews.length > 0) {
                review = location.reviews.id(request.params.reviewid);
                if (!review) {
                sendJsonResponse(response, 404, { message: "reviewid not found"});
            } else {
                review.author = request.body.author;
                review.rating = request.body.rating;
                review.reviewText = request.body.reviewText;
                location.save(function(error, location) {
                    if (error) {
                        sendJsonResponse(response, 404, error);
                    } else {
                        updateAverageRating(location._id);
                        sendJsonResponse(response, 200, review);
                    }
                });
            }
        } else {
            sendJsonResponse(response, 404, { message: "No review to update" });
        }
    });
};

module.exports.reviewDeleteOne = function(request, response) {
    if (!request.params.locationid || !request.params.reviewid) {
        sendJsonResponse(response, 404, { message: "Not found, locationid and reviewid are both required" });
        return;
    }

    Loc.findById(request.params.locationid)
        .select("reviews")
        .exec(function(error, location) {
            if (!location) {
                sendJsonResponse(response, 404, { message: "locationid not found" });
                return;
            } else if(error) {
                sendJsonResponse(response, 400, error);
            }
            if (location.reviews && location.reviews.length > 0) {
                if (location.reviews.id(request.params.reviewid)) {
                    sendJsonResponse(response, 404, { message: "reviewid not found" });
                } else {
                    updateAverageRating(location._id);
                    sendJsonResponse(response, 204, null);
                }
            } else {
                sendJsonResponse(response, 404, "No review to delete");
            }
        });
};

