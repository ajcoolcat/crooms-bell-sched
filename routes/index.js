const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('*', (req, res) => {
  res.sendStatus(404)
  res.send(__dirname + '/error/404.html');
});

module.exports = router;
