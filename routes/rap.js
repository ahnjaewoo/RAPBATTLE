var express = require("express");
var router = express.Router();
var Rap = require('../models/Rap');

router.get('/rap', function (req, res) {
  Rap.find().exec(function (err, raps) {
    if (err) return res.json({success: false, message: err});
    res.json(raps);
  });
});

router.post('/rap', function (req, res) {
  Rap.create({title: req.body.title, topic: req.body.topic, bitid: req.body.bitid,
    uid: req.body.uid, lyricid: req.body.lyricid, like: req.body.like}, function (err, rap) {
      if (err) return res.json({success:false,message:err});
      res.json({success:true});
    });
});

module.exports = router;
