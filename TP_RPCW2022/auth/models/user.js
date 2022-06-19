const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    descricao: {type: String, required: false},
    estatuto: {type: String, required: true},
    filiacao: {type: String, required: true},
    nivel: {type: String, required: true},
    dataRegisto: {type: Date, default: Date.now},
    bloqueado: {type: Boolean, required: true, default: false}
})

module.exports = mongoose.model('user', userSchema, 'users')