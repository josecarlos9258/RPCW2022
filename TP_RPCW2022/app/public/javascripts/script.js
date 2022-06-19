$(document).ready(function() {

    $('#botaoFiltrar').click(function(event) {
        event.preventDefault()

        var filtroTitulo = $('#filtrarTitulo').val();
        var filtroTipo = $('#filtrarTipo').val();

        console.log(filtroTitulo)
        console.log(filtroTipo)
        var url = "/"
        if(filtroTitulo != ""){
            url += "?q=" + filtroTitulo
        }
        if(filtroTipo != ""){
            if (url == "/"){
                url += "?tipo=" + filtroTipo
            }
            else {
                alert("Selecione apenas um tipo de filtro!")
                return
            }
        }
        location.href = url
    })

    $('#botaoLimparFiltro').click(function(event) {
        event.preventDefault()

        location.href = "/"
    })

})