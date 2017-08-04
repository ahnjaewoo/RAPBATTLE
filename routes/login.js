var express = require("express");
var router = express.Router();
var passport = require('../config/passport');

router.get('/login',function(request,response){
    if(request.user)
    response.render('loginpage',{user:request.user,email:request.flash("email")[0],loginError:request.flash('loginError')});
    else
    response.render('loginpage',{user:"",email:request.flash("email")[0],loginError:request.flash('loginError')});
});

router.post('/login',function(request,response,next){
        console.log("로그인 시도 email : "+request.body.idInput);
        console.log("로그인 시도 email 길이 : "+request.body.idInput.length);
        if(request.body.idInput.length===0||request.body.pwInput.length===0)
        {
            request.flash("email",request.body.idInput);
            request.flash("loginError","이메일과 비밀번호를 입력해 주세요");
            response.redirect('/login');
        } else {
            next();
        }
    } , passport.authenticate('login-check',{
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    })
);

module.exports = router;
