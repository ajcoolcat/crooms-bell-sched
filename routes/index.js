const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/gradecalc/', function(req, res, next) {
  res.redirect("/?goto=gradecalc");
});

router.get('/download/', function(req, res, next) {
  res.redirect("/?goto=download");
});

module.exports = router;