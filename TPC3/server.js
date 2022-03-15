const http = require('http')
const url = require('url')
const axios = require('axios')


function genMainPage() {
    mainpage = `
    <!DOCTYPE html>\n
        <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta+Stencil">  
        </head>
        <body>
            <div class="w3-container w3-teal w3-margin w3-dark-grey">
                <p class="w3-small"> RPCW 2021/2022 TPC3</p>
            </div> 

            <div class="w3-container w3-margin-left">
                <h2><a href=/alunos>Lista de Alunos</a></h2>
            </div>

            <div class="w3-container w3-margin-left">
                <h2><a href=/cursos>Lista de Cursos</a></h2>
            </div>

            <div class="w3-container w3-margin-left">
                <h2><a href=/instrumentos>Lista de Instrumentos</a></h2>
            </div>

            <div class="w3-container w3-teal w3-margin w3-dark-grey">
            <p class="w3-small"> José Carlos Magalhães | RPCW 2021/2022 </p>
            </div>
        </body>
</html>
    `
    return mainpage
}


function getStudents() {
    return axios.get('http://localhost:3000/alunos')
        .then(function (resp) {
            return resp.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getCourses() {
    return axios.get('http://localhost:3000/cursos')
        .then(function (resp) {
            return resp.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getInstruments() {
    return axios.get('http://localhost:3000/instrumentos')
        .then(function (resp) {
            return resp.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}


function genStudentsPage(res) {
    var header = `<!DOCTYPE html>\n
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta+Stencil">  
    </head>
    <body>
        <div class="w3-container w3-teal w3-margin w3-dark-grey">
            <p class="w3-small"> RPCW 2021/2022 TPC3 - Página dos Alunos</p>
        </div> 
    `

    header += "<center><table><tr><th>ID</th><th>Nome</th><th>Data De Nascimento</th></tr>"

    getStudents().then(clss => {
        clss.forEach(s => {
            header += "<tr> <td>" + s.id + "</td> <td>" + s.nome + "</td> <td>" + s.dataNasc + "</td> </tr>"
        })
        header += `</table>
            </center>
        </div>
            <div class="w3-container w3-teal w3-margin w3-dark-grey">
                <p class="w3-small"> José Carlos Magalhães | RPCW 2021/2022 </p>
            </div>
        </body>
    </html>`
        res.write(header)
        res.end()
    }).catch(error => {
        console.log("Erro: " + error)
        res.write("<p>Não existem alunos disponíveis.</p>")
        res.end()
    })
}


function genCoursesPage(res) {
    var header = `<!DOCTYPE html>\n
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta+Stencil">  
    </head>
    <body>
    <div class="w3-container w3-teal w3-margin w3-dark-grey">
                <p class="w3-small"> RPCW 2021/2022 TPC3 - Página dos Cursos</p>
            </div> 
    `
    header += "<center><table><tr><th>ID</th><th>Designação</th><th>Duração</th><th>ID</th><th>Instrumento</th></tr>"
    getCourses().then(course => {
        course.forEach(c => {
            header += "<tr> <td>" + c.id + "</td> <td>" + c.designacao + "</td> <td>" + c.duracao + "</td> <td>" + c.instrumento.id + "</td> <td>" + c.instrumento["#text"] + "</td>  </tr>"
        })
        header += `</table></center></div><div class="w3-container w3-teal w3-margin w3-dark-grey">
            <p class="w3-small"> José Carlos Magalhães | RPCW 2021/2022 </p>
            </div>
        </body>
</html>`
        res.write(header)
        res.end()
    }).catch(error => {
        console.log("Erro: " + error)
        res.write("<p>Não existem cursos disponíveis.</p>")
        res.end()
    })
}




function genInstrumentsPage(res) {
    var header = `<!DOCTYPE html>\n
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta+Stencil">  
    </head>
    <body>
    <div class="w3-container w3-teal w3-margin w3-dark-grey">
                <p class="w3-small"> RPCW 2021/2022 TPC3 - Página dos Instrumentos</p>
            </div> 
    `
    header += "<center><table><tr><th>ID</th><th>Instrumento</th></tr>"
    getInstruments().then(inst => {
        inst.forEach(i => {
            header += "<tr> <td>" + i.id + "</td> <td>" + i["#text"] + "</td> </tr>"
        })
        header += `</table></center></div><div class="w3-container w3-teal w3-margin w3-dark-grey">
        <p class="w3-small"> José Carlos Magalhães | RPCW 2021/2022 </p>
        </div>
    </body>
</html>`
        res.write(header)
        res.end()
    }).catch(error => {
        console.log("Erro: " + error)
        res.write("<p>Não existem instrumentos disponíveis.</p>")
        res.end()
    })
}



http.createServer(function (req, res) {
    var myurl = url.parse(req.url, true).pathname

    if (myurl == "/") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write(genMainPage())
        res.end()
    }
    else if (myurl == "/alunos") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        genStudentsPage(res)
    }
    else if (myurl == "/cursos") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        genCoursesPage(res)
    }
    else if (myurl == "/instrumentos") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        genInstrumentsPage(res)
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end("<p>Tente outra opção.</p>" + req.url + "</p>")
    }
}).listen(4000);