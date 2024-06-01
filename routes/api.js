/**
 * @swagger
 * components:
 *   schemas:
 *     Links:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente pelo DB
 *         code:
 *           type: string
 *           description: Código ID da url encurtada
 *         url:
 *           type: string
 *           description: Url Original
 *         hits:
 *           type: Number
 *           description: Quantidades de hits efetuado no link encurtado
 *         createdAt:
 *           type: string
 *           description: Data que a URL foi encurtada
 *         updatedAt:
 *           type: string
 *           description: Data que a URL foi encurtada  
 *     
 */

/**
 * @swagger
 * tags:
 *   name: API
 *   description: Gerenciador de URL da API
 * /api/findAll:
 *   get:
 *     summary: Listas de todas as URL encurtadas
 *     tags: [API]
 *     responses:
 *       200:
 *         description: Listas de todas URL
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Links'
 *       404:
 *         description: Erro ao tentar ser encurtada* 
 * 
 * /api/getUrl/{id}:
 *   get:
 *     summary: Retorna informações da Url encurtada pelo ID gerado
 *     tags: [API]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Retorna Url encurtada pelo code gerado automaticamente
 *     responses:
 *       200:
 *         description: Resposta da url encurtada pelo ID 
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Links'
 *       404:
 *         description: Erro ao retornar URL
 *   
 * /api/new/{url}:
 *   get:
 *     summary: Encurta nova URL
 *     tags: [API]
 *     parameters:
 *       - in: path
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: Url original a ser encurtada
 *     responses:
 *       200:
 *         description: The book response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Links'
 *       404:
 *         description: Erro ao tentar ser encurtada
 *
 * /api/find/{date}:
 *   get:
 *     summary: Retorna todas as URL pela data informada
 *     tags: [API]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Retorna todas as URL pela data informada - Formato da data YYYY-MM-DD = "2024-05-20"
 *     responses:
 *       200:
 *         description: Todas as URl pela data informada
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Links'
 *       404:
 *         description: URL não encontrada com a data informada.
 *     
*/

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
  res.redirect('/api-docs');
});


module.exports = router;
