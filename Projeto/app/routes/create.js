var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var AdmZip  = require('adm-zip')
var mime = require('mime-types')
var axios = require('axios');
const pathLib = require('path')

const aux = require('./funcs')

var upload = multer({dest: 'uploads/'})

router.get('/', function(req, res) {
    res.render('create', {})
})

router.get('/file', function(req, res) {
    res.render('form', {})
})

router.post('/file', upload.single('file'), async function(req, res) {
    console.log(req.body)
    let oldPath = pathLib.join(__dirname,'/../',req.file.path)
    let newPath = pathLib.join(__dirname, '/../uploads/', req.file.originalname+'.zip')

    fs.renameSync(oldPath, newPath, function(err) {
        if(err)
            throw err;
    })

    console.log(oldPath)
    console.log(newPath)

    console.log("File received")

    try {
        var files = aux.loadZipAndProcessIt(newPath,req.body)
    } catch (error) {
        console.log(error)
    }

    var authors = req.body.authors.split(',')
    var titles = req.body.titles.split(',')
    var creationDates = req.body.creationDates.split(',')
    var fileTypes = req.body.fileTypes.split(',')

    files.then(function (files) {
        console.log(files)
        for(var i = 0; i < files.length; i++) {
            var file = files[i]
            var fileActualPath = pathLib.normalize(__dirname.replace('/routes','/public/files' + file))
            var fileObj = {
                creationDate: creationDates[i],
                submissionDate: new Date().toISOString().substring(0,16),
                author: authors[i],
                submitter: 'admin',
                title: titles[i],
                mimetype: mime.lookup(fileActualPath),
                size: fs.lstatSync(fileActualPath).size,
                path: file,
                fileType: fileTypes[i]
            }

            console.log(fileObj)

            axios.post('http://localhost:10000/api/file',fileObj)
                .then(function(response) {res.status(200).redirect('/')})
                .catch(function(error) {
                    res.status(500).end("Could not create file: Connection to db refused")
                    console.log("Connection Refused")
                    fs.rmSync(fileActualPath, {recursive: true})
                })            
        }

    })
    .catch(err => {
        console.log(err)
        res.status(500).render('error', { error: err })
    })
})

router.get('/xml', upload.single('file'), function(req, res) {
    res.render('formXML', {})
})

router.post('/xml', upload.single('file'), function(req, res) {
    console.log(req.body)
    let oldPath = pathLib.join(__dirname,'/../',req.file.path)
    let newPath = pathLib.join(__dirname,'/../uploads/',req.file.originalname + '.zip')

    fs.renameSync(oldPath, newPath, function(err) {
        if(err)
            throw err;
    })

    console.log(oldPath)
    console.log(newPath)

    console.log("File received")

    try {
        var filesXML = aux.loadZipAndProcessIt(newPath,req.body)
    } catch (error) {
        console.log(error)
    }

    filesXML.then(arr => {
        var xml = arr[0]
        var xmlActualPath = pathLib.normalize(__dirname.replace('routes','/public/files' + xml))
        var metaData = aux.xmlValidatorAndExtractor(xmlActualPath)
        if(metaData == undefined) {
            res.status(500).end('Not acceptable xml')
            fs.rmSync(xmlActualPath, {recursive: true})
        }
        else {
            var fileObj = {
                creationDate: metaData.creationDate,
                submissionDate: new Date().toISOString().substring(0,16),
                author: metaData.author,
                submitter: 'admin', // Mudar!
                title: metaData.title,
                mimetype: mime.lookup(xmlActualPath),
                size: fs.lstatSync(xmlActualPath).size,
                path: xml,
                fileType: metaData.fileType
            }
    
            console.log(fileObj)

            axios.post('http://localhost:10000/api/file',fileObj)
                .then(function(response) {res.status(200).redirect('/')})
                .catch(function(error) {
                    res.status(500).end("Could not create file: Connection to db refused")
                    console.log("Connection Refused")
                    fs.rmSync(xmlActualPath, {recursive: true})
                })

        }

    })

})

module.exports = router;