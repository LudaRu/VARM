const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/', (req, res, next) => {
  console.log('123', req);

  res.render('index');
});

module.exports = router;
