var express = require("express");
var router = express.Router();
var Topic = require('../models/Topic');

router.get('/topic', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/topic', function (req, res) {
  console.log(1111);
  Topic.create({topic: req.body.topic },function(err,topic){
      if(err) return res.json({success:false,message:err});
      res.json({success:true});
  });
});

module.exports = router;
