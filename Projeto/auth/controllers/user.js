// Controlador para o modelo User
var User = require('../models/user')

// Devolve a lista de utilizadores
module.exports.listar = () => {
    return User
        .find()
        .sort('nome')
        .exec()
}

module.exports.consultar = email => {
    return User
        .findOne({ email })
        .exec()
}

module.exports.inserir = u => {
    var novo = new User(u)
    return novo.save()
}

module.exports.remover = function (email) {
    return User.deleteOne({ email })
}

module.exports.alterar = function (u) {
    return User.findByIdAndUpdate({ email: u.email }, u, { new: true })
}