var User = require('../models/user')


module.exports.listar = () => {
    return User
        .find()
        .sort('+username')
        .exec()
}

module.exports.consultar = id => {
    return User
        .findOne({_id : id})
        .exec()
}

module.exports.inserir = u => {
    var novo = new User(u)
    return novo.save()
}

module.exports.remover = function(id) {
    return User.deleteOne({_id : id})
}

module.exports.alterar = function(u) {
    return User.findByIdAndUpdate({_id: u._id}, u, {new: true})
}