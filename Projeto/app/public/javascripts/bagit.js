async function compressFiles(files) {
    zip = new JSZip();
    var manifestContents = ''

    var bagIt = 'BagIt-Version: 0.97\nTag-File-Character-Encoding: UTF-8'
    var manifest = []

    for(let i = 0; i < files.length; i++) {

        var file = files[i].files[0]
        
        var hash = await getFileHash(file)
        manifestContents += hash
        manifestContents += ' data/' + file.name

        manifest.push(manifestContents)

        manifestContents = ''

        zip.file('data/' + file.name, file)

    }

    console.log(manifest)

    zip.file('manifest-md5.txt',manifest.join('\n'))

    zip.file('bagit.txt',bagIt)

    return new Promise(function(resolve, reject) {
        resolve(zip)
        reject = undefined
    })

}

async function getFileHash(file) {

    return new Promise(function(resolve, reject) {
        var fileName = file.name
        fr = new FileReader();
    
        fr.onload = function() {
            var fileContents = fr.result
            hash = CryptoJS.MD5(fileContents).toString()
            console.log(`Hash for ${fileName} is: ${hash}`)
            resolve(hash)
        }
    
        fr.readAsText(file)

    })

}