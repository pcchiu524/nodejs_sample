var express = require('express');
var fs = require("fs");
var path = require("path");
var markdown = require("markdown").markdown;
var router = express.Router();

/* GET home page. */
router.get('/markdown', function(req, res, next) {
    res.render('README.md', {layout: false});  
});

module.exports = router;
