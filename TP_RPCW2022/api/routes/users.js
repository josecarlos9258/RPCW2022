var express = require('express');
var router = express.Router();
const User = require('../controllers/user')


/** Users */

router.get('/', function(req, res, next) {
    User.listar()
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(507).jsonp({error: e}))
});

router.get('/:id', function(req, res, next) {
    User.consultar(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(508).jsonp({error: e}))
})

router.put('/:id', function(req, res, next) {
    User.alterar(req.body)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(509).jsonp({error:e}))
})

router.post('/registo', function (req, res) {
    User.inserir(req.body)
      .then(dados => res.status(201).jsonp({ dados }))
      .catch(error => res.status(510).jsonp({ error }))
  })

router.delete('/:id', function(req, res, next) {
    User.alterar(({
            _id: req.params.id,
            bloqueado: true
        }))
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(511).jsonp({error: e}))
})

module.exports = router;