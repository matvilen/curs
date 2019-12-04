const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// POST is register
router.post('/register', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    
    if (!login || !password || !passwordConfirm){
        const fields = [];
        if (!login) fields.push('login');
        if (!password) fields.push('password');
        if (!passwordConfirm) fields.push('passswordConfirm');
        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены!',
            fields: fields
          });
    } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
        res.json({
            ok: false,
            error: 'Только латинские',
            fields: ['login']
          });
    } else if (login.length < 3 || login.length > 16) {
        res.json({
          ok: false,
          error: 'Длина логина от 3 до 16 символов!',
          fields: ['login']
        });
    } else if (password !== passwordConfirm) {
        res.json({
          ok: false,
          error: 'Пароли не совпадают!',
          fields: ['password', 'passwordConfirm']
        });
    } else if (password.length < 5 ) {
        res.json({
          ok: false,
          error: 'Минимальная длина пароля 5 символов!',
          fields: ['password', 'passwordConfirm']
        });
    }else {
        models.User.findOne({
            login
        }).then(user => {
            if(!user){
        
                bcrypt.hash(password, null, null, (err, hash) => {
                    models.User.create({
                    login,
                    password: hash
                    }).then(user => {
                            console.log(user);
                            req.session.userID = user.id;
                            req.session.userLogin = user.login;
                            res.json({
                            ok:true
                            });
                    }).catch(err => {
                            console.log(err);
                            res.json({
                            ok:false,
                            error: 'Ошибка, попробуйте позже'
                            });
                        })
                });
            } else {
                res.json({
                    ok: false,
                    error: 'Имя занято!',
                    fields: ['login']
                })
            }
        });
    }
});

// POST is authorized //авторизация на основе сессий, т к это более безопасно по сравнению с куки
router.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    if (!login || !password ){
        const fields = [];
        if (!login) fields.push('login');
        if (!password) fields.push('password');

        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены!',
            fields: fields
          });
          //если поля не пустые, то ищем в БД логин и проверяем пароль (сверяем по хешу)
    }else {
        models.User.findOne({ 
          login
        }).then(user => {
            if (!user){
        
                res.json({
                    ok: false,
                    error: 'Логин и пароль неверны!',
                    fields: ['login', 'password']
                  });
            } else {
                //проверка пароля //неверный
                bcrypt.compare(password, user.password, function(err, result) {
                    if (!result) {
                      res.json({
                        ok: false,
                        error: 'Логин и пароль неверны!',
                        fields: ['login', 'password']
                      });
                    } else {        //верный пароль, то ...
                      req.session.userId = user.id;         //в объекте сессия создаем юзера
                      req.session.userLogin = user.login;
                      res.json({
                        ok: true
                      });
                    }
                  });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
            ok:false,
            express: 'Ошибка, попробуйте позже'
            });
        });
        }
    });

    // GET for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {           //если в сесси что-то есть, то разрушаем эту страничку и отправляем эти даннык на главную
      res.redirect('/');
    });
  } else {
    res.redirect('/');                    //если ничего нет, то просто на главную
  }
});

module.exports = router;
