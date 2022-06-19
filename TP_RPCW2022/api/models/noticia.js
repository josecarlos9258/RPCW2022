const mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({
  idAutor: {type: String, required: true},
  nomeAutor: {type: String, required: true},
  recurso: {type: {
    id: {type: String, required: true},
    titulo: {type: String, required: true},
    tipo: {type: String, required: true},
    estado: {type: String, required: true}
  }, required: true},
  visibilidade: {type: Boolean, required: true},
  data: {type: String, required: true}
});

module.exports = mongoose.model('noticia', noticiaSchema, 'noticias')