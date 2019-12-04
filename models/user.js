const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//описание схемы
const schema = new Schema({
    login:{
        type: String,
        required: true, //т.е. заголовок обязателен
        unique: true
    },
    password:{
            type: String,
            required: true
    }
},
    {
        timestamps: true
    }
);

//делаем обращ-е в формате JSON, в том числе для того, чтобы сделать не _id, a id
schema.set('toJSON',{
    virtuals:true
})

module.exports = mongoose.model('User', schema);