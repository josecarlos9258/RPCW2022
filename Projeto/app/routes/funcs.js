var AdmZip  = require('adm-zip')
const crypto = require('crypto')
const fs = require('fs')
var libxmljs = require('libxmljs');
const pathLib = require('path')

async function loadZipAndProcessIt(path) {
    var zip = new AdmZip(path)

    var extractPath = pathLib.join(__dirname,'/../uploads/')
    zip.extractAllTo(extractPath)
    var zipContents = zip.getEntries()

    fs.readdirSync(extractPath).forEach(file => console.log(file))

    var valid = true
    var files = []
    for (const entry of zipContents) {
        if(entry.name == 'manifest-md5.txt') {
            var manifestData = entry.getData().toString().split('\n')

            for(const data of manifestData) {
                var sepData = data.split(' ')
                var fileName = sepData.slice(1).join(' ')

                let filePath = pathLib.join(extractPath,fileName)

                var fileHash = await getMd5Hash(filePath)

                if(fileHash == sepData[0]) {
                    files.push(fileName)
                }
                else {
                    valid = false
                }

            }

        }
    }

    var returnFiles = []

    if(valid) {
        for(const fileName of files) {
            var d = new Date().toISOString().substring(0,10)
            var directoryPath = pathLib.normalize(__dirname.replace('routes','public/files/' + d + '/'))
            if(!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath)
            }

            var realName = fileName.split('data/')[1]
            var filePath = __dirname.replace('routes','uploads')
            filePath=pathLib.join(filePath,fileName)
            
            var newPath = directoryPath + realName
            fs.renameSync(filePath, newPath)
            returnFiles.push('/' + d + '/' + realName)
        }
    }

    fs.readdir(extractPath, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
            fs.rmSync(extractPath + file, {recursive: true})
        }
    });

    return returnFiles

}

async function getMd5Hash(path) {
    
    var fileContents = fs.readFileSync(path)
    hash = crypto.createHash('md5').update(String(fileContents)).digest("hex")
    return hash

}

function xmlValidatorAndExtractor(xmlActualPath) {
    var xmlContent = String(fs.readFileSync(pathLib.normalize(xmlActualPath)), {encoding: 'utf-8'})
    var schemaContent = String(fs.readFileSync(pathLib.normalize(__dirname.replace('routes','public/XMLSchema/aulaP.xsd')), {encoding: 'utf-8'}))

    var xsdDoc = libxmljs.parseXmlString(schemaContent);
    var xmlDoc = libxmljs.parseXmlString(xmlContent)

    var valid = xmlDoc.validate(xsdDoc)
    if(!valid) {
        return undefined
    }

    var returnData = {
        creationDate: xmlDoc.get('meta/datas/data').text(),
        author: xmlDoc.get('meta/autor').text(),
        title: xmlDoc.get('meta/titulo').text(),
        fileType: xmlDoc.get('meta/tipo').text()
    }

    return returnData

}





module.exports = {
    loadZipAndProcessIt,
    xmlValidatorAndExtractor
}