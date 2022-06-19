$(document).ready(function() {

    $('#add-one-file').click(function(event) {
        event.preventDefault()

        var title = $("<label for='form-title'>Titulo</label> <input type='text' name='title' class='file-title' placeholder='Título'> <br>")
        var author = $("<label for='form-author'>Autor</label> <input type='text' name='author' class='file-author' placeholder='Autor'> <br>")
        var creationDate = $("<label for='form-creationDate'>Data de Criação</label> <input type='date' name='creationDate' class='file-creationDate'> <br>")
        var file = $("<label for='form-file'>Ficheiro</label> <input type='file' name='file' class='file'> <br>")
        $('#add-one-file').before(title)
        $('#add-one-file').before(author)
        $('#add-one-file').before(creationDate)
        $('#add-one-file').before(file)

    })

    $('#submit-file').click(function(event) {
        event.preventDefault();
        console.log("...");
        var fd = new FormData();
        var title = $('.file-title');
        var author = $('.file-author')
        var creationDate = $('.file-creationDate')
        var files = $('.file');

        var autorRecurso = $('#autorRecurso').val()
        var tituloRecurso = $('#tituloRecurso').val()
        var descRecurso = $('#descRecurso').val()
        var tipoRecurso = $('#tipoRecurso').val()
        var dataCriacao = $('#dataCriacao').val()
        var visibilidade = $('#visibilidade').val()


        console.log(autorRecurso);
        console.log(tituloRecurso);
        console.log(descRecurso);
        console.log(tipoRecurso);
        console.log(dataCriacao);
        console.log(visibilidade);

        if(tituloRecurso.length == 0){
            alert("Insira um título para o recurso.")
            return
        }

        if(tipoRecurso.length == 0){
            alert("Insira um tipo para o recurso.")
            return
        }

        for(var tit of title) {
            if(tit.value.length == 0) {
                alert("Please fill all fields")
                return
            }
        }

        for(var aut of author) {
            if(aut.value.length == 0) {
                alert("Please fill all fields")
                return
            }
        }

        for(var file of files) {
            if(file.files.length == 0) {
                alert("Please fill all fields")
                return
            }
        }

        for(var date of creationDate) {
            if(date.value.length == 0) {
                alert("Please fill all fields")
                return
            }
        }
        
        arrTitles = []
        arrAuthors = []
        arrFiles = []
        arrCreationDates = []

        for(let i = 0; i < files.length; i++) {
            arrTitles.push(title[i].value)
            arrAuthors.push(author[i].value)
            arrCreationDates.push(creationDate[i].value)
        }

        console.log(arrTitles)
        console.log(arrCreationDates)
        console.log(files[0].files[0].name)


        fd.append('autorRecurso', autorRecurso)
        fd.append('tituloRecurso', tituloRecurso)
        fd.append('descRecurso', descRecurso)
        fd.append('tipoRecurso', tipoRecurso)
        fd.append('dataCriacao', dataCriacao)
        fd.append('authors', arrAuthors)
        fd.append('titles', arrTitles)
        fd.append('creationDates', arrCreationDates)
        fd.append('visibilidade', visibilidade)
        

        compressAndSendZip(files,fd,'file')

        console.log("Compressing...")

    })

    $("#submit-xml").click(function(e) {
        e.preventDefault()

        var xml = $('.xml');

        if(xml[0].files.length == 0) {
            alert("Please fill all fields")
            return
        }

        var fd = new FormData();

        compressAndSendZip(xml,fd,'xml')

        console.log("Compressing xml...")

    })
})

async function compressAndSendZip(files,fd,type) {
    zip = await compressFiles(files)

    console.log(zip)

    zip.generateAsync({type:'blob'})
            .then(function(data) {

                fd.append('file',data)

                console.log(fd.get('file'))

                $.ajax({
                    url: 'http://localhost:20000/recursos/' + type + '/',
                    type: 'POST',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function() {
                        alert('File created successfully')
                        window.location.href = "/";
                    },
                    error: function(request) {
                        alert(request.responseText)
                    }
                })

            })
            .catch(function (err) {
                console.log(err)
            })
}