console.log('app');
var express = require('express');
const bodyParser = require('body-parser');//for linking body-parser
const path = require('path')              //т. к. сервак и пути прописываем самостоятельно
const config = require('./config'); 
const staticAsset = require('static-asset');                            //браузеры сохр-т css в cookie и редко обновляют, а тут будут обяз-но обновлять
// const Report = require('./models/report')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const routes = require('./routes'); 



//database
    mongoose.Promise=global.Promise;                  //нужно global, а то будет ругаться
    mongoose.set('debug', config.IS_PRODUCTION);      //каждый раз пишем в лог наше обращение
                                                      //в проде - false
    mongoose.connection
            .on('error', error => console.log(error))
            .on('close', ()=> console.log('Database connection closed.'))
            .once('open',() => {
              const info = mongoose.connections[0];
              console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
              //require('./mocks')();                                             //фейковое наполнение
            });

    mongoose.connect(config.MONGO_URL, {eseMongoClient: true }); //MONGO_URL is situated in config.js
            
//express
var app = express();

// sessions
app.use(
  session({
    secret: config.SESSION_SECRET, //штука для криптографии
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

// sets and users
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}));//непорсредственно применяем парсер- ещё и расширенный зачем-то 
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'public'))); //статически через express прописываем путь __dirname к нужному файлу из нашей папки 'public'
app.use(
    '/javascripts',
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

//routers
app.use('/', routes.archive);
app.use('/api/auth', routes.auth);
app.use('/report', routes.report);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {           //если ошибка на сервере - то писаться конкретные ошибки не будут
  res.status(error.status || 500);             //иначе будут
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

app.listen(config.PORT, () =>     //если подключение к бд будет успешным, то произойдет прослушивание порта
      console.log(`Example app listening on port ${config.PORT} !`)
    );
                                              //app.get('/123', function(req, res){ res.send('Send')}) просто вывести текст

                                                // app.get('/',(req, res) =>{
                                                //     Report.find({}).then(reports =>{  //получаем из БД выборку документов, а из них получается массив объектов reports_o
                                                //         res.render('index', {reports: reports}); //передаем массив объектов-reports_o в шаблон reports_sh в index.ejs
                                                //     });
                                                // });
    



app.get('/create_hr', function (req, res){ res.render('create')} )

//POST

                                                                            // // })
                                                                            // app.post('/create_hr', (req, res) => {   //реструктуризация - изменение кода на этапе, когда прогер понимает как было бы хорошо организовать код, после того как он уже написан
                                                                            //     const {title, body} = req.body; //мы получили объект с полями title и body 
                                                                            //                                     //запись в БД (путём реструктуризации поля превращаются в переменные)
                                                                            //     Report.create({                  //это объект обещание(Promise)
                                                                            //         title:title,
                                                                            //         body:body
                                                                            //     }).then(report => console.log(report.id));
                                                                            //     res.redirect('/');
                                                                            //                                     //arr.push(req.body.text);
                                                                            // });

module.exports = app;