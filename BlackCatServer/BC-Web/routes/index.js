var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/ybxc', function(req, res, next) {
  res.render('ybxc', { title: 'Express' });
});

module.exports = router;
