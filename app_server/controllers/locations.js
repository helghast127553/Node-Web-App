const request = require("request");
const apiOptions = {
    server: "http://localhost:3000/"
};
if (process.env.NODE_ENV === "production") {
    apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}

let _showError = function(req, res, status) {
    let title = null;
    let content = null;

    if (status === 404) {
        title = "404, page not found";
        content = "oh dear. Looks like we can not find this page. Sorry.";
    } else {
        title = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong";
    }

    res.status(status);
    res.render("generic-text", {
        title: title,
        content: content 
    });
};

let renderReviewPage = function(req, res, responseBody) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: { title: 'Review Starcups' },
        error: req.query.error
    });
};

let renderHomePage = function(req, res, responseBody) {
    let message = undefined;

    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No places found nearby";
        }
    }

    res.render("locations-list", { 
        title: "Loc8r - find a place to work with wifi", 
        pageHeader: {
            title: "Loc8r",
            strapline: "Find places to work with wifi near you!"
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about." + 
        "Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
        locations: responseBody,
        message: message
    });
};

let renderDetailPage = function(req, res, responseBody) {
    res.render("location-info", { 
        title: responseBody.name, 
        pageHeader: {
            title: responseBody.name,
        },
        sidebar:{
            context: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about." + 
            "Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
            callToAction: "If you\'ve been and you like it - or if you don\'t -please leave a review to help other people just like you."
        },
        location: responseBody,
    });
};

let  getLocationInfo = function(req, res, callbackFunction) {
    const path = "api/location/" + req.params.locationid;
    const requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
    };
    
    request(requestOptions, function(error, response, body) {
        let data = body;

        if (response.statusCode === 200) {
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            callbackFunction(req, res, data);
        } else {
            _showError(req, res, response.statusCode);
        }       
    });
};

module.exports.homeList = function(req, res) {
    const path = "api/locations";
    const requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
        // qs: {
        //     lng: -0.9690884,
        //     lat: 51.455041,
        //     maxDistance: 20
        // }
    };

    request(requestOptions, function(error, response, body) {    
        renderHomePage(req, res, body);
    });
};


module.exports.locationInfo = function(req, res) {
    getLocationInfo(req, res, function(req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

module.exports.addReview = function(req, res) {
   getLocationInfo(req, res, function(req, res, responseData) {
       renderReviewPage(req, res, responseData);
   });
};

module.exports.doAddReview = function(req, res) {
    const path = "api/location/" + req.params.locationid + "/reviews";
    const data = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    const requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: data
    };

    if (!data.author || !data.rating || !data.reviewText) {
        res.redirect("/location/" + req.params.locationid + "/reviews/new?error=val");
    } else {
        request(requestOptions, function(error, response, body) {
            if (response.statusCode === 201) {
                res.redirect("/location/" + req.params.locationid);
            } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
                res.redirect("/location/" + locationid + "/review/new?error=val")
            } else {
                console.log(body);
                _showError(req, res, response.statusCode);
            }
        });
    }
}