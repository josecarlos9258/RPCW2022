var express = require("express");
var router = express.Router();
var axios = require("axios");

var aux = require("./auxiliars");

/* GET home page. */
router.get("/", function (req, res, next) {
    if (!req.cookies.token) aux.consumerTokenGenerator(req.originalUrl, res);
    else aux.renderIndex(req.cookies.token, res, req, {});
});


module.exports = router;
