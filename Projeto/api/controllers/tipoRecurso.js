var TipoRecurso = require('../models/tipoRecurso')


module.exports.listar = () => {
    return TipoRecurso
        .find({}, {_id: 0, tipo:1})
        .sort({tipo:1})
        .exec()
}

module.exports.inserir = tipos => {
    return TipoRecurso.insertMany(tipos)
}