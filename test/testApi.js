const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server")

chai.should();
chai.use(chaiHttp);

describe("GET Api", function() {
    it("get all locations", function(done) {
        let lng = -0.9690884;
        let lat = 51.455041;
        let maxDistance = 20;

        chai.request(server)
            .get("/api/locations?lng=" + lng 
            + "&lat=" + lat 
            + "&maxDistance=" + maxDistance)
            .end(function(error, response) {
                response.should.have.status(200);
                response.body.should.be.a("array");
                response.body.length.should.be.eq(4);
                done();
            });
    });

    it("not get all locations", function(done) {
        let lng = -0.9690884;
        let lat = 51.455042;
        let maxDistance = 20;

        chai.request(server)
            .get("/api/locations?lng=" + lng 
            + "&lat=" + lat 
            + "&maxDistance=" + maxDistance)
            .end(function(error, response) {
                response.should.have.status(404);
                done();
            }); 
    });

    it("get a location", function(done) {
        let locationid = "5f151b2248d2552b305a6815";

        chai.request(server)
            .get("/api/location/" + locationid)
            .end(function(error, response) {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.have.property("_id");
                response.body.should.have.property("name");
                response.body.should.have.property("address");
                response.body.should.have.property("coords");
                response.body.should.have.property("rating");
                response.body.should.have.property("facilities");
                response.body.facilities.should.be.a("array");
                response.body.should.have.property("openingTimes");
                response.body.openingTimes.should.be.a("array");
                response.body.should.have.property("reviews");
                response.body.reviews.should.be.a("array");
                done();
            });
    });

    it("not get a location", function(done) {
        let locationid = "5f151b2248d2552b305a6816";

        chai.request(server)
            .get("/api/location/" + locationid)
            .end(function(error, response) {
                response.should.have.status(404);
                done();
            });
    });
});

describe("POST Api", function() {
    it("post review", function(done) {
        let locationid = "5f15415d3df1bb2dc8775239";
        let data = {
            author: "Thu",
            rating: 4,
            reviewText: "Worst Coffee ever!"
        };

        chai.request(server)
            .post("/api/location/" + locationid + "/reviews")
            .send(data)
            .end(function(error, response) {
                response.should.have.status(201);
                response.body.should.be.a("object");
                response.body.should.have.property("author");
                response.body.author.should.be.eq(data.author);
                response.body.should.have.property("rating");
                response.body.rating.should.be.eq(data.rating);
                response.body.should.have.property("reviewText");
                response.body.reviewText.should.be.eq(data.reviewText);
                done();
            });
    });

    it("can not post review", function(done) {
        let locationid = "5f1547223df1bb2dc877523b";
        let data = {};
    
        chai.request(server)
            .post("/api/locations/" + locationid + "reviews")
            .send(data)
            .end(function(error, response) {
                response.should.have.status(404);
                done();
            });
    });
});