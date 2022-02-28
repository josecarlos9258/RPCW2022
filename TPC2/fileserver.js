var http = require('http')
var fs = require('fs')

myServer = http.createServer(function (req, res) {
    myUrl = "./data/"
    fields = req.url.slice(1).split("/")
    console.log(fields)
    if (fields[0] == "actors" && fields.length == 2) {
        myUrl += "actorId" + fields[fields.length - 1] + ".html"
    }
    else if (fields[0] == "movies" && fields.length == 2) {
        myUrl += "movieId" + fields[fields.length - 1] + ".html"
    }
    else {
        myUrl += "index.html"
    }

    fs.readFile(myUrl, function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        var d = new Date().toISOString().substring(0, 16)
        console.log(req.method + " " + req.url + " " + d)
        if (err) {
            res.write("<h1>Error</h1>")
        } else {
            res.write(data)
        }
        res.end()
    })
    myUrl = ""
})

myServer.listen(7777)
console.log("Listening on port 7777...")