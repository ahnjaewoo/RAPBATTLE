var express = require("express");
var router = express.Router();
var Rap = require('../models/Rap');

router.get('/rap', function (req, res) {
    Rap.find().exec(function (err, raps) {
        if (err) return res.json({success: false, message: err});
        res.json(raps);
    });
});

router.post('/rap/find', function (req, res) {
    var query={};
    if(req.body.uid){
        query={uid:req.body.uid};
    }
    if(req.body.topic){
        query={topic:req.body.topic};
    }

    Rap.find(query,function (err, raps) {
        if (err) return res.json({success: false, message: err});
        res.json(raps);
    });
});

router.post('/rap', function (req, res) {
    req.body.lyric = req.body.lyric?req.body.lyric:"";
    Rap.create({
        title: req.body.title,
        topic: req.body.topic,
        bitid: req.body.bitid,
        lyric:req.body.lyric,
        uid: req.body.uid,
        lyricid: req.body.lyricid,
        like: req.body.like
    },
    function (err, rap) {
        if (err) return res.json({success:false,message:err});
        res.json({success:true});
    });
});

router.post('/rap/del',function(req,res){
    Rap.findOneAndRemove({_id:req.body.rid},function(err,result){
        if(err){
            res.json({success:false});
        }
        else {
            res.json({success:true});
        }
    });
});
router.post('/rap/like',function(req,res){
    Rap.findOne({_id:req.body.rid},function(err,rapone){
        if(err){
            res.json({success:false});
        }
        rapone.like.push(req.body.uid);
        rapone.save();
        res.json({success:true});
    });
});

router.post('/rap/dislike',function(req,res){
    Rap.findOne({_id:req.body.rid},function(err,rapone){
        if(err){
            res.json({success:false});
        }
        for(var i=0;i<rapone.like.length;i++){
            if(rapone.like[i]==req.body.uid){
                rapone.like.splice(i,1);
            }
        }
        rapone.save();
        res.json({success:true});
    });
});

module.exports = router;
