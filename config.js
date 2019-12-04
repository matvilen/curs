const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

//главная конфигурация - настройка БД и тд
console.log('config');
module.exports = {
    PORT: process.env.PORT || 3000, //если не будет указана переменная окружения, то авт-ки подставится последнее значение, т.е. 3000
                                   //переменные окр-я в package.json - у меня, где start
    MONGO_URL:process.env.MONGO_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    PER_PAGE: process.env.PER_PAGE          //кол-во постов на странице
 };
