var express = require('express');
var router = express.Router();
const Publicacao = require('../controllers/publicacao');

router.get('/', function(req, res) {
    Publicacao.listar()
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(501).jsonp({error: e}))
})

router.get('/autor/:id', function(req,res){
    Publicacao.pubsUtilizador(req.params.id)
        .then(dados=>res.status(200).jsonp(dados))
        .catch(e => res.status(502).jsonp({error: e}))
})

router.get('/:id', function(req, res) {
    Publicacao.consultar(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(503).jsonp({error: e}))
})

router.get('/recurso/:id', function(req, res) {
    Publicacao.consultarRecurso(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(508).jsonp({error: e}))
})

router.post('/', function(req,res){
    Publicacao.inserir(req.body.pub)
        .then(dados => res.status(201).jsonp(dados))
        .catch(e => res.status(504).jsonp({error: e}))
})

// Atualizar estado para indisponível
router.post('/atualizarEstado/:id', function(req, res){
    Publicacao.atualizarEstado(req.params.id, req.body.visRecurso)
        .then(dados => res.status(201).jsonp({dados}))
        .catch(e => res.status(505).jsonp({error: e}))
})

router.post('/comentar/:id', function(req,res){
    Publicacao.addComentario(req.params.id, req.body)
      .then(dados => res.status(201).jsonp(dados))
      .catch(e => res.status(506).jsonp({error: e}))
})

router.delete('/:id', function(req,res){
    Publicacao.remover(req.params.id)
      .then(dados => res.status(201).jsonp(dados))
      .catch(e => res.status(507).jsonp({error: e}))
})

module.exports = router;