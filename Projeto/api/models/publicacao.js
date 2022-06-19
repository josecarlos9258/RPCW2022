const mongoose = require('mongoose')


var pubSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    descricao: {type: String, required: true},
    idAutor: {type: String, required: true},
    nomeAutor: {type: String, required: true},
    idRecurso: {type: String, required: true},
    dataCriacao: {type: String, required: true, default: new Date().toISOString().substr(0,19)},
    dataModificacao: {type: String, required: false},
    visRecurso: {type: Boolean, required: true, default: true},
    comments: {type:[{
        idUser : {type: String, required: true},
        username: {type: String, required: true},
        comment: {type: String, required: true},
        commentDate: {type: String, required: true, default: new Date().toISOString().substr(0,19)}
    }], default:[]}
})

module.exports = mongoose.model('pub', pubSchema, 'pubs')