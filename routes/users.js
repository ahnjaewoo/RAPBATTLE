var express = require("express");
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var User = require('../models/User');
var bcrypt = require("bcrypt-nodejs");
var isLoggedIn = require("../common/isLoggedIn");

router.get('/users/new',function(request,response){
    console.log("new 호출");
    response.render('users/new',{
    });
});

router.post('/users',checkUserRegValidation,function(req,res,next){
    //새로운 User 만드는 곳.;;
    User.create({email:req.body.idInput,password:req.body.pwInput,nickname:req.body.nicknameInput},function(err,user){
        if(err) return res.json({success:false,message:err});
        res.redirect('/login');
    });
});

router.get('/users/edit',isLoggedIn,function(request,response){
//    User.findById(req.params.id,function(err,user){
//        if(err) return res.json({success:false,message:err});
    console.log("edit 호춣");
    response.render('users/edit',{
    });
//    });
});
router.get('/users/show',isLoggedIn,function(req,res){
//    User.findById(req.params.id,function(err,user){ 우리는 모든 유저의 값을 가지고 있기 때문이당 ㅎ_ㅎ
//        if(err) return res.json({success:false,message:err});
        console.log("show 호출");
        res.render("users/show",{user:req.user});
//    });
});



router.post('/users/show',isLoggedIn,function(req,res){
//    User.findById(req.params.id,req.body.user,function(err,user){
//        if(err) return res.json({success:false,message:err});
//여기는 user edit하는곳 !!
    console.log("Users.put하러 들어온다.");
    if(bcrypt.compareSync(req.body.user.currPwInput,req.user.password))//user.authenticate(req.body.user.currPwInput))//==req.user.password)
    {
        async.waterfall(
            [function(callback){

                if(req.body.user.pwInput){//이거 이래도 되나?
                    if(req.body.user.pwInput.length<6)
                    {
                        req.flash("formData",req.body.user);
                        req.flash("passwordError","비밀번호는 6자이상 입력해 주세요");
                        console.log("비밀번호 오류로 back");
                        res.redirect('/users/edit');
                        callback(null,false,null);
                        return;
                    }
                    req.body.user.password=bcrypt.hashSync(req.body.user.pwInput);//User.hash(req.body.user.pwInput);
                }
                else {
                    delete req.body.user.password;//없다면 그냥 갱신을 안한답니다~
                }
                if(!validateNick(req.body.user.nicknameInput)&&req.body.user.nicknameInput)
                {
                    req.flash("nicknameError","영문으로 된 4~20자리의 닉네임을 입력 해 주세요");
                    delete req.body.user.nickname;
                    res.redirect('/users/edit');
                    callback(null,false,null);
                    return;
                }
                else if(req.body.user.nicknameInput){
                    var isValid=true;
                    async.waterfall(
                        [function(callback){
                            User.findOne({nickname:req.body.user.nicknameInput,_id:{$ne: mongoose.Types.ObjectId(req.params.id)}},
                                function(err,user){
                                    if(user){
                                        isValid=false;
                                        req.flash("nicknameError","이미 있는 닉네임 입니다.");
                                    }
                                    callback(null,isValid);
                                }
                            );
                        },function(isValid,callback){
                            if(isValid){
                                return callback(null,isValid);
                            } else {
                                console.log("닉네임 중복으로 back");
                                req.flash("formData",req.body.user);
                                res.redirect("back");
                                return;
                            }
                        }],function(err,isValid){
                            if(err) return res.json({success:false,message:err});
                            req.body.user.nickname=req.body.user.nicknameInput;
                            console.log(req.body.user+"을 주입하러 갑니다");
                            callback(null,true,req.body.user);
                        }
                    );
                }
                else {
                    delete req.body.user.nickname;
                    callback(null,true,req.body.user);
                }
            }

        ],function(err,isValid,userInput){
            if(isValid===true){
                User.findByIdAndUpdate(req.user._id,userInput,function(err,user){
                    console.log("req.user.id를 태워서 찾기 : "+req.user._id);
                    console.log("찾은 user :"+user);
                    console.log("nickname : "+userInput.nickname);
                    if(err) return res.json({success:false,message:err});
                    if(userInput.nickname) req.user.nickname=userInput.nickname;
                    res.redirect('/users/show');
                });
            }
        });
    }else{
        req.flash("formData",req.body.user);
        req.flash("curpasswordError","비밀번호가 다릅니다");
        res.redirect('/users/edit');
    }
//    });
});

router.get('/users/del',isLoggedIn,function(req,res){
    res.render('users/delete',{
        user : req.user,
        formData:req.flash('formData')[0],
        emailError:req.flash('emailError')[0],
        curpasswordError:req.flash('curpasswordError')[0]
    });
});
router.post('/users/del',isLoggedIn,function(req,res){
    console.log("User 탈퇴하러 들어온다.");
    if(bcrypt.compareSync(req.body.user.currPwInput,req.user.password))//user.authenticate(req.body.user.currPwInput))//==req.user.password)
    {
        User.remove({_id:req.user._id},function(err,user){
            console.log("req.user.id를 태워서 찾기 : "+req.user._id);
            console.log("찾은 user :"+user);
            if(err) return res.json({success:false,message:err});
            req.logout();
            res.redirect('/');
        });
    }else{
        req.flash("formData",req.body.user);
        req.flash("curpasswordError","비밀번호가 다릅니다");
        res.redirect('/users/del');
    }
});
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validateNick(email) {
    var re =  /^[a-z0-9_]{4,20}$/;
    return re.test(email);
}
function checkUserRegValidation(req,res,next){
    var isValid = true;
    async.waterfall(
        [function(callback){
            console.log(req.body.idInput+"을 찾습니다");
            if(req.body.pwInput.length<6)
            {
                req.flash("passwordError","비밀번호 6자리 이상 입력해 주세요.");
                isValid=false;
                callback(null,isValid);
                return ;
            }
            if(!validateNick(req.body.nicknameInput))
            {
                req.flash("nicknameError","영어 소문자와 숫자로 된 4~20자리의 닉네임을 입력 해 주세요");
                isValid=false;
                callback(null,isValid);
                return;
            }
            if(!validateEmail(req.body.idInput))
            {
                req.flash("emailError","올바른 이메일 형식을 입력 해 주세요.");
                isValid=false;
                callback(null,isValid);
                return;
            }
            User.findOne({email:req.body.idInput,_id:{$ne: mongoose.Types.ObjectId(req.params.id)}},
                function(err,user){
                    if(user){
                        isValid=false;
                        req.flash("emailError","이미 있는 이메일 입니다.");
                    }

                    callback(null,isValid);
                }
            );
        },function(isValid,callback){
            User.findOne({nickname:req.body.nicknameInput,_id:{$ne: mongoose.Types.ObjectId(req.params.id)}},
                function(err,user){
                    if(user){
                        isValid=false;
                        req.flash("nicknameError","이미 있는 닉네임 입니다.");
                    }
                    callback(null,isValid);
                }
            );
        }],function(err,isValid){
            if(err) return res.json({success:false,message:err});
            if(isValid){
                return next();
            } else {
                res.redirect("back");
            }
        }
    );
}


module.exports = router;
