var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')

var User = require('../controllers/user')

// Listar os Utilizadores
router.get('/', function (req, res) {
  User.listar()
    .then(dados => res.status(200).jsonp({ dados: dados }))
    .catch(e => res.status(500).jsonp({ error: e }))
})



router.get('/consumidor', function(req, res) {
  jwt.sign({
    nivel: 'consumidor',
    sub: 'TP_RPCW2022'}, 
    "TP_RPCW2022",
    {expiresIn: "1h"},
    function(e, token) {
      if(e) res.status(511).jsonp({error: "Erro na geração do token de consumidor: " + e}) 
      else res.status(201).jsonp({token})
  })
})


router.post('/registo', passport.authenticate('signup-auth'), function(req, res) {
    if (req.user.success) {
      jwt.sign({
        username: req.user.user.username,
        email: req.user.user.email, 
        nivel: req.user.user.nivel,
        _id: req.user.user._id,
        sub: 'TP_RPCW2022'}, 
        "TP_RPCW2022",
        {expiresIn: "1d"},
        function(e, token) {
          if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
          else res.status(201).jsonp({token})
      })
    }
    else res.status(201).jsonp({invalidInput: req.user.invalidInput, error: req.user.message}) 
  })

  router.post('/login', passport.authenticate('login-auth'), function(req, res) {
    if (req.user.success && req.user.user.bloqueado == false) {
      jwt.sign({
        _id: req.user.user._id,
        username: req.user.user.username,
        nivel: req.user.user.nivel,
        sub: 'TP_RPCW2022'
    }, 
        "TP_RPCW2022",
        {expiresIn: "1d"},
        function(e, token) {
          if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
          else res.status(201).jsonp({token})
      })
    }
    else res.status(201).jsonp({invalidInput: req.user.invalidInput, error: req.user.message}) 
  })


module.exports = router;