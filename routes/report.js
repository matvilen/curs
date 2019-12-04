const express = require('express');
const router = express.Router();
const turndownService = require('turndown');

const models = require('../models');


// GET for add
router.get('/add', (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
 
  if (!userId || !userLogin){
    res.redirect('/')
  }else{
    res.render('report/add', {
    user: {
      id: userId,
      login: userLogin
    }
  });
  }
});

// POST is add (report)
router.post('/add', (req, res) => {
  console.log('start');
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin){
    res.redirect('/')
  }else{

  const title = req.body.title.trim().replace(/ +(?= )/g, ''); //корректировка - если 2 пробела, то стнет 1
  const body = req.body.body;
  const TurndownService = new turndownService();
  
  if (!title || !body){
    
    const fields = [];
    if (!title) fields.push('title');
    if (!body) fields.push('body');
    
    res.json({
        ok: false,
        error: 'Все поля должны быть заполнены!',
        fields: fields
      });
} else if (title.length < 3 || title.length > 64) {
  res.json({
    ok: false,
    error: 'Длина заголовка от 3 до 64 символов!',
    fields: ['title']
  });
} else if (body.length < 3 ) {
  res.json({
    ok: false,
    error: 'Текст должен быть не менее 3ех символов!',
    fields: ['body']
  });
} else{
  
  models.Report.create({
    title,
    body: TurndownService.turndown(body),
    owner: userId 
  }).then(report => {
    console.log(report);
    res.json({
    ok:true
  });
  }).catch(err => {
    console.log(err);
    console.log('err');
    res.json({
      ok:false
    });
  });
 }  
  }
  
  
});

module.exports = router;