const express = require('express');
const router = express.Router();
const Link = require('../models/link');
const sequelize = require('../db');

function generateCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}


router.get('/new/:url', async (req, res, next) => {
  const url = req.params.url;
  const code = generateCode();

  const resultado = await Link.create({
    url,
    code
  })

  return res.json(resultado);
})


router.get('/getUrl/:code', async (req, res, next) => {
  const code = req.params.code;

  const resultado = await Link.findOne({ where: { code } });

  if (!resultado) {
    return res.status(400).json({
      error: "Url não encontrada"
    })
  }

  resultado.hits++;
  await resultado.save();
  return res.json(resultado);
})


router.get('/find/:date', async (req, res) => {
  const date = req.params.date;

  const resultado = await Link.findAll({
    where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', date),

  })

  if (!resultado || resultado == '') {
    return res.status(400).json({
      error: "Url não encontrada com a data informada!!"
    })
  }

  return res.json(resultado);

})

router.get('/findAll', async (req, res) => {

  const resultado = await Link.findAll();

  if (!resultado) return res.sendStatus(404);

  return res.json(resultado);

})


/* GET api . */
router.use('/', function (req, res, next) {
  res.render('api_index', { title: 'Documentação da API' });
});


module.exports = router;
