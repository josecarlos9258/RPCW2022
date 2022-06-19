var express = require("express");
var router = express.Router();
var axios = require("axios");

var aux = require("./auxiliars");


router.get('/', function(req,res) {
    if (!req.cookies.token) aux.consumerTokenGenerator(req.originalUrl, res)
    else {
        var token = aux.unveilToken(req.cookies.token)

        axios.get('http://localhost:10000/api/noticias?token=' + req.cookies.token)
        .then(noticias => {

            res.render("noticias", {
                id: token._id,
                nivel: token.nivel,
                nome: token.username,
                noticias: noticias.data,
                });

            })
            .catch(error => res.render('error', {error}))
    }
})


module.exports = router;
