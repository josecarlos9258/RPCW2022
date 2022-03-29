var express = require('express');
var router = express.Router();
var axios = require("axios");

router.get('/', function (req, res, next) {
  axios.get("http://localhost:3000/musicas/")
    .then(response => {
      var list = response.data
      var d = new Date().toISOString().substring(0, 16)
      var jsonData = {
        "data": d
      }
      res.render('musicas', { title: 'Músicas', musicas: list, data: jsonData })
    }).catch(err => {
      res.render('error', { error: erro });
    })
});

router.get('/musicas', function (req, res, next) {
  axios.get("http://localhost:3000/musicas/")
    .then(response => {
      var list = response.data
      var dados = response.data[0]
      console.log(dados)
      res.render('musicas', { musicas: list });
    })
    .catch(function (erro) {
      res.render('error', { error: erro });
    })
});

router.get('/:id', function (req, res, next) {
  axios.get("http://localhost:3000/musicas?id=" + req.params.id)
    .then(response => {
      var dados = response.data[0]
      console.log(dados)
      res.render('musica', { musica: dados });
    })
    .catch(function (erro) {
      res.render('error', { error: erro });
    })
});

router.get('/prov/:id', function (req, res, next) {
  axios.get("http://localhost:3000/musicas?prov=" + req.params.id)
    .then(response => {
      var dados = response.data
      console.log(dados)
      res.render('provincia', { musicas: dados, provincia: req.params.id });
    })
    .catch(function (erro) {
      res.render('error', { error: erro });
    })
});

module.exports = router;
