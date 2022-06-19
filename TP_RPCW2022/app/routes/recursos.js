var express = require("express");
var router = express.Router();
var axios = require("axios");
var moment = require("moment");
var multer = require("multer");
var fs = require("fs");
var mime = require("mime-types");
var AdmZip = require('adm-zip')


const pathLib = require("path");


var aux = require("./auxiliars");
const auxFiles = require("./funcs");
var bagit = require("../public/javascripts/bagit");
const { token } = require("morgan");



var upload = multer({ dest: "uploads/" });

router.get("/", function (req, res) {
    if (!req.cookies.token) aux.consumerTokenGenerator(req.originalUrl, res);
    else {
        var token = aux.unveilToken(req.cookies.token)
        axios.get(`http://localhost:10000/api/publicacoes/autor/${token._id}?token=` + req.cookies.token)
            .then(pubs => {
                var publicacoes = pubs.data
                axios.get(`http://localhost:10000/api/recursos/autor/${token._id}?token=` + req.cookies.token)
                    .then(recursos => {
                        var recs = recursos.data;
                        res.render('recursos', { nivel: token.nivel, nome: token.username,  id: token._id, pubs: publicacoes, recursos: recs })
                    }).catch(error => res.render('error', { error }))
            })
            .catch(error => res.render('error', { error }))

    }
});

router.get('/:id', function (req, res) {
    if (!req.cookies.token) aux.consumerTokenGenerator(req.originalUrl, res)
    else {
        var token = aux.unveilToken(req.cookies.token)
        axios.get('http://localhost:10000/api/recursos/' + req.params.id + '?token=' + req.cookies.token)
            .then(dados => {
                var recInfo = {}
                var recurso = dados.data

                var dono = token._id == recurso.idAutor || token.nivel == 'admin'
                var classif = recurso.ratings

                if (!classif.length) classif = 0
                else classif.reduce((total, prox) => total + prox.rating, 0) / classif.length

                recInfo["id"] = recurso._id
                recInfo["titulo"] = recurso.titulo
                recInfo["tipo"] = recurso.tipo
                recInfo["descricao"] = recurso.descricao
                recInfo["classificacao"] = classif
                recInfo["nomeAutor"] = recurso.nomeAutor
                recInfo["idAutor"] = recurso.idAutor
                recInfo["tamanho"] = recurso.tamanho / (1024 * 1024) //Conversão de bytes para mb.
                recInfo["dataCriacao"] = recurso.dataCriacao
                recInfo["dataRegisto"] = recurso.dataRegisto
                recInfo["dataUltimaMod"] = recurso.dataUltimaMod
                recInfo["ficheiros"] = recurso.ficheiros
                recInfo["nrDownloads"] = recurso.nrDownloads

                axios.get('http://localhost:10000/api/publicacoes/recurso/' + recurso._id + '?token=' + req.cookies.token)
                    .then(dados => {
                        var pub = dados.data
                        var comentarios = pub.comments
                        res.render('recurso', {recurso: recInfo, dono, comentarios: comentarios,pubId: pub._id, nome: token.username})
                    })
                    .catch(error => res.render('error', {error}))


               
            })
            .catch(error => res.render('error', { error }))
    }
})

router.post("/file", upload.single("file"), async function (req, res) {
    if (!req.cookies.token) auxFiles.consumerTokenGenerator(req.originalUrl, res);
    else {
        var token = aux.unveilToken(req.cookies.token);
        let oldPath = pathLib.join(__dirname, "/../", req.file.path);
        let newPath = pathLib.join(__dirname, "/../uploads/", req.file.originalname + ".zip");

        fs.renameSync(oldPath, newPath, function (err) {
            if (err) throw err;
        });

        console.log(oldPath);
        console.log(newPath);

        console.log("File received");

        try {
            var files = auxFiles.loadZipAndProcessIt(newPath, req.body);
        } catch (error) {
            console.log(error);
        }

        var authors = req.body.authors.split(",");
        var titles = req.body.titles.split(",");
        var creationDates = req.body.creationDates.split(",");

        var autorRecurso = req.body.autorRecurso;
        var tituloRecurso = req.body.tituloRecurso;
        var descRecurso = req.body.descRecurso;
        var tipoRecurso = req.body.tipoRecurso;
        var dataRecurso = req.body.dataCriacao;

        var visibilidadeRecurso = (req.body.visibilidade == "on")

        var filesList = [];

        files.then(function (files) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var fileActualPath = pathLib.normalize(__dirname.replace("/routes", "/public/files" + file));

                var fileObj = {
                    creationDate: creationDates[i],
                    submissionDate: new Date().toISOString().substring(0, 16),
                    author: authors[i],
                    submitter: token.nivel,
                    title: titles[i],
                    mimetype: mime.lookup(fileActualPath),
                    size: fs.lstatSync(fileActualPath).size,
                    path: file,
                };

                filesList.push(fileObj);
            }
            var dataAtual = new Date().toISOString().substr(0, 19);

            var recursoObj = {
                idAutor: token._id,
                nomeAutor: autorRecurso,
                titulo: tituloRecurso,
                tipo: tipoRecurso,
                descricao: descRecurso,
                dataCriacao: dataRecurso,
                dataRegisto: dataAtual,
                dataUltimaMod: dataAtual,
                visibilidade: visibilidadeRecurso,
                ficheiros: filesList
            }

            axios.post('http://localhost:10000/api/recursos?token=' + req.cookies.token, { recurso: recursoObj })
                .then(recurso => {
                    var novoRecurso = recurso.data.dados

                    pubObj = {
                        titulo: tituloRecurso,
                        descricao: descRecurso,
                        idAutor: token._id,
                        nomeAutor: token.username,
                        idRecurso: novoRecurso._id,
                        dataCriacao: dataRecurso,
                        visRecurso: novoRecurso.visibilidade
                    }

                    axios.post('http://localhost:10000/api/publicacoes?token=' + req.cookies.token, { pub: pubObj })
                        .then(pub => {

                            var noticiaObj = {
                                idAutor: token._id,
                                nomeAutor: token.username,
                                recurso: {
                                    id: novoRecurso._id,
                                    titulo: novoRecurso.titulo,
                                    tipo: novoRecurso.tipo,
                                    estado: 'Novo'
                                },
                                visibilidade: novoRecurso.visibilidade,
                                data: dataAtual
                            }

                            axios.post('http://localhost:10000/api/noticias?token=' + req.cookies.token, { noticia: noticiaObj })
                                .then(dados => res.redirect('/recursos'))
                                .catch(error => res.render('error', { error }))
                        
                        })
                        .catch((error) => res.render("error", { error }))

                })
                .catch((error) => res.render("error", { error }));
        })
            .catch((err) => {
                console.log(err);
                res.status(500).render("error", { error: err });
            });
    }
});


router.post('/editar/:id', function (req, res) {
    if (!req.cookies.token) aux.consumerTokenGenerator(req.originalUrl, res)
    else {
        var token = aux.unveilToken(req.cookies.token)

        //verifica que é mesmo o autor antes de avançar com a edição
        if ((token.nivel == 'produtor' || token.nivel == 'admin'))/*&& token._id == req.body.idAutor)*/{ //TODO: Confirmar isto

            req.body.visibilidade = (req.body.visibilidade == 'on')

            req.body["dataUltimaMod"] = new Date().toISOString().substr(0, 19);
            console.log(req.body)

            axios.post('http://localhost:10000/api/recursos/editar/' + req.params.id + '?token=' + req.cookies.token, req.body)
                .then(rec => {
                    
                    console.log(rec.data);
                    var noticiaObj = {
                        idAutor: token._id,
                        nomeAutor: token.username,
                        recurso: {
                            id: req.params.id,
                            titulo: req.body.titulo,
                            tipo: req.body.tipo,
                            estado: 'Atualizado'
                        },
                        visibilidade: req.body.visibilidade,
                        data: new Date().toISOString().substr(0, 19)
                    }

                    axios.post('http://localhost:10000/api/noticias?token=' + req.cookies.token, { noticia: noticiaObj })
                        .then(n => {

                            if (req.body.visibilidade) {
                                axios.post('http://localhost:10000/api/publicacoes/atualizarEstado/' + req.params.id + '?token=' + req.cookies.token, { visRecurso: true })
                                .then(p => {
                                    res.redirect('/recursos/' + req.params.id)
                                })
                                .catch(error => res.render('error', { error }))
                            }
                            else {
                                axios.post('http://localhost:10000/api/publicacoes/atualizarEstado/' + req.params.id + '?token=' + req.cookies.token, { visRecurso: false })
                                .then(p => {
                                    res.redirect('/recursos/' + req.params.id)
                                })
                                .catch(error => res.render('error', { error }))
                            }
                        })
                        .catch(error => res.render('error', { error }))
                })
                .catch((error) => res.render("error", { error }))

        }
        else res.status(401).render("error", {mensagem: "Não lhe é possível editar uma publicação porque não possui uma conta. Registe-se / faça login para isso."});

    }

})

// Classificar um recurso!
router.post('/classificar/:id', (req, res) => {
    if (!req.cookies.token) aux.consumerTokenGenerator(req.originalUrl, res)
    else {
        var token = aux.unveilToken(req.cookies.token);

        if (token.nivel == 'produtor' || token.nivel == 'admin') {

            axios.put(`http://localhost:10000/api/recursos/${req.params.id}/classificar/?token=${req.cookies.token}`,
                { user: token._id, rating: Number.parseInt(req.body.rating) })
                .then(rec => {
                    var recurso = rec.data.dados
                    var noticiaObj = {
                        idAutor: token._id,
                        nomeAutor: token.username,
                        recurso: {
                            id: recurso._id,
                            titulo: recurso.titulo,
                            tipo: recurso.tipo,
                            estado: 'Classificado'
                        },
                        visibilidade: recurso.visibilidade,
                        data: new Date().toISOString().substr(0, 19)
                    }
                    //console.log(noticiaObj)
                    axios.post('http://localhost:10000/api/noticias?token=' + req.cookies.token, { noticia: noticiaObj })
                        .then(n => {
                            res.redirect('/')
                        })
                        .catch(error => res.render('error', { error }))
                })
                .catch(error => res.render('error', { error }))
        }
        else res.render('error', {mensagem: "Não lhe é possível classificar uma publicação porque não possui uma conta. Registe-se / faça login para isso."})
    }
})


//a funcionar crl
router.get("/download/:id", (req, res) => {
    if (!req.cookies.token) aux.consumerTokenGenerator(req.originalUrl, res);
    else {
        axios.get("http://localhost:10000/api/recursos/" + req.params.id + "?token=" + req.cookies.token)
            .then((recursoData) => {

                var rec = recursoData.data
                console.log(rec)
                let titulo = recursoData.data.titulo;
                let ficheiros = recursoData.data.ficheiros;
                var zip = aux.zipRecurso(ficheiros);

                axios.post("http://localhost:10000/api/recursos/inc/" + req.params.id + "?token=" + req.cookies.token)
                    .then(() => {
                        res.writeHead(200, {
                            "Content-Type": "application/zip",
                            "Content-Disposition": `attachment; filename=${titulo}.zip`,
                        })
                        res.write(zip);
                        res.end();
                    })
                    .catch((errors) => {
                        res.render("error", { error: errors })
                    });
            })

            .catch((error) => res.render("error", { error }));
    }
});

router.get("/preview/:rid/:id", (req, res) => {
    if (!req.cookies.token) aux.consumerTokenGenerator(req.originalUrl, res);
    else {
        axios.get("http://localhost:10000/api/recursos/" + req.params.rid + "?token=" + req.cookies.token)
            .then((recursoData) => {
                console.log(recursoData.data.ficheiros[0].path)
                auxFiles.openInNewTab("/files" + recursoData.data.ficheiros[0].path);


            })
            .catch((error) => res.render("error", { error }));
    }
});

module.exports = router;
