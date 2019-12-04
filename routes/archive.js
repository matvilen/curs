const express = require('express');
const router = express.Router();

const config = require('../config');
const models = require('../models');

function reports(req, res){
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;             //ставим +, а то прочитает как строку а не число
  const page = req.params.page || 1 ;           //задаем страницу, но если она не задана, то по умолчанию будет 1 

  models.Report.find({})
    .skip(perPage * page - perPage)       //умножаем кол-во постов на одну страницу на саму искомую страницу 
                                                            //и вычитаем кол-во постов на одной странице - короче ищем пост с 
                                                            //которого нужно начинать
    .limit(perPage)                         //берем сколько должно быть на странице
    .then(reports => {
        models.Report.count().then(count => {
            res.render('index', {                            //передаем юзера на гл стр
                    reports,
                    current: page,
                    pages: Math.ceil(count / perPage),
                user: {
                  id: userId,
                  login: userLogin
                }
            }); 
        }).catch(console.log);
    })
    .catch(console.log);
}

// routers
router.get('/',(req, res) => reports(req, res));
router.get('/archive/:page', (req, res) => reports(req, res));           //эта ф-ция прописана выше;

module.exports =router;