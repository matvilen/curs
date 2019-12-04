const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs')
const tr = require('transliter');

//описание схемы
const schema = new Schema({
    title:{
        type: String,
        required: true //т.е. заголовок обязателен
    },
    body:{
            type: String
    },
    owner: {
        type: Schema.Types.ObjectId,  //для того чтобы связать того кто оставил пост с самим постом
        ref: 'User'
    }
},
    {
        timestamps: true
    }
);

schema.plugin(
    URLSlugs('title', {
        field:'url',
        generator: text => tr.slugify(text)
    })
);

//делаем обращ-е в формате JSON, в том числе для того, чтобы сделать не _id, a id
schema.set('toJSON', {
    virtuals:true
});

module.exports = mongoose.model('Report', schema);