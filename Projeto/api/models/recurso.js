const mongoose = require('mongoose')

var fileSchema = new mongoose.Schema({
    creationDate: {type: String, required: true},
    submissionDate: {type: String, required: true},
    author: {type: String, required: true},
    submitter: {type: String, required: true},
    title: {type: String, required: true},
    mimetype: {type: String, required: true},
    size: {type: Number, required: true},
    path: {type: String, required: true},
})

var recursoSchema = new mongoose.Schema({
    idAutor: {type: String, required: true},
    nomeAutor: {type: String, required: true},
    titulo: {type: String, required: true},
    tipo: {type: String, required: true},
    descricao: {type: String, required: false},
    dataCriacao: {type: String, required: true},
    dataRegisto: {type: String, required: true},
    dataUltimaMod: {type: String, required: true},
    ratings: {type: [{
        user: {type: String, required: true},
        rating: {type: Number, required: true}
    }], default: []},
    visibilidade: {type: Boolean, required: true},
    ficheiros: {type: [fileSchema], default: []},
    nrDownloads: {type: Number, default: 0}
})

module.exports = mongoose.model('recurso', recursoSchema, 'recursos')