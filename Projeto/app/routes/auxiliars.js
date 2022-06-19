var jwt = require('jsonwebtoken')
var keyToken = "TP_RPCW2022"
var crypto = require("crypto")
var fs = require('fs')
var mime = require('mime-types')
var moment = require('moment')
var axios = require('axios')
var AdmZip = require('adm-zip')


function consumerTokenGenerator(url, res) {
    axios.get('http://localhost:30000/users/consumidor')
        .then(dados => {
            res.cookie('token', dados.data.token, {
                expires: new Date(Date.now() + '1h'),
                secure: false,
                httpOnly: true
            })

            res.redirect(url)
        })
        .catch(error => res.render('error', { error }))
}

function unveilToken(token) {
    var t = null;

    jwt.verify(token, keyToken, function (e, decoded) {
        if (e) {
            console.log('Erro: ' + e)
            t = null
        }
        else return t = decoded
    })

    return t
}

function variaveisRecursos(recursos, tipos_bd, cookiesToken, meus_recursos) {
    var token = unveilToken(cookiesToken)
    var nomesAutores = []
    var idsAutores = []

    var tipos = []
    tipos_bd.data.forEach(t => tipos.push(t.tipo))

    recursos.forEach(r => {
        r.tamanho = calculateSize(r.tamanho)
        r.dono = token._id == r.idAutor || token.nivel == 'admin'
        r.dataUltimaMod = moment(r.dataUltimaMod).format('HH:mm:ss, DD-MM-YYYY')

        if (!idsAutores.includes(r.idAutor)) {
            idsAutores.push(r.idAutor)
            nomesAutores.push(r.nomeAutor)
        }
    })

    return { nivel: token.nivel, recursos, tipos, autores: nomesAutores.sort(), meus_recursos }
}


function groupAndSortByDate(list) {
    var grupo = {}
    list.forEach(o => {
        var dia = o
        if (!(dia in grupo)) {
            grupo[dia] = []
        }
        grupo[dia].push(o)
    })

    for (var [data, lista] of Object.entries(grupo)) {
        lista.sort((a, b) => {
            let x1 = a.data
            let x2 = b.data
            return new Date(x2).getTime() - new Date(x1).getTime();
        })
    }
    var orderedDates = {}
    Object.keys(grupo).sort(function (a, b) {
        return moment(b, 'YYYY/MM/DD').toDate() - moment(a, 'YYYY/MM/DD').toDate();
    }).forEach(function (key) {
        orderedDates[key] = grupo[key];
    })
    return orderedDates
}

function renderIndex(cookiesToken, res, req, atribs) {
    var token = unveilToken(cookiesToken)
    var url = ""

    if(Object.keys(req.query).length != 0){
        var query = Object.keys(req.query)[0]
        
        url = query + '=' + req.query[query]
    }
    else {
        url = ""
    }

    axios.get('http://localhost:10000/api/recursos?token=' + cookiesToken +"&"+url)
                    .then(recursos => {
                        var recs = recursos.data;
                        let promessas = []
                        recs.forEach(rec => {
                            promessas.push(axios.get('http://localhost:10000/api/publicacoes/recurso/' + rec._id + '?token=' +cookiesToken))
                        })
                        
                        Promise.all(promessas)
                            .then(dados => {
                                let pubs = []
                                dados.forEach(pub => {
                                    if(pub.data != null)
                                        pubs.push(pub.data)
                                })

                                axios.get('http://localhost:10000/api/noticias/index?token=' + cookiesToken)
                                    .then(noticias => {
                                        var noticias = noticias.data
                                        var id = token._id
                                        res.render('index', { nivel: token.nivel, id, nome: token.username, pubs: pubs, noticias: noticias, recursos: recs, ...atribs })
                                    })
                                    .catch(error => res.render('error', { error }))
                            })
                            .catch(error => res.render('error', { error }))
                        })
                        .catch(error => res.render('error', { error }))
}


function zipRecurso(ficheiros) {
    var zip = new AdmZip()
    var dir = __dirname.replace(/\\/g, "/").replace("routes", "public/files")
    ficheiros.forEach(f => {
        let nome = f.path.replace("/files/", "")
        console.log("o nome e" + nome)
        zip.addLocalFile(dir + f.path)
    })
    return zip.toBuffer()
}

module.exports = {
    consumerTokenGenerator,
    unveilToken,
    renderIndex,
    variaveisRecursos,
    groupAndSortByDate,
    zipRecurso
}