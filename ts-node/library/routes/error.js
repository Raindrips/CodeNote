var express = require('express');
var router = express.Router();

/* error page. */
router.get('/error', function(req, res, next) {
  res.render('error', { title: 'Express' });
});

module.exports = router;
