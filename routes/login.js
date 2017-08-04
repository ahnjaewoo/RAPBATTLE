var express = require("express");
var router = express.Router();
var passport = require('../config/passport');

// router.get('/login',function(request,response){
//     if(request.user)
//     response.render('loginpage',{user:request.user,email:request.flash("email")[0],loginError:request.flash('loginError')});
//     else
//     response.render('loginpage',{user:"",email:request.flash("email")[0],loginError:request.flash('loginError')});
// });


router.get('/login/success',function(request,response){
    response.json({status:"success"});
});
router.get('/login/failure',function(request,response){
    response.json({status:"failure"});
});

router.post('/login',function(request,response,next){
        console.log("로그인 시도 email : "+request.body.idInput);
        console.log("로그인 시도 email 길이 : "+request.body.idInput.length);
        if(request.body.idInput.length===0||request.body.pwInput.length===0)
        {
            // request.flash("email",request.body.idInput);
            // request.flash("loginError","이메일과 비밀번호를 입력해 주세요");
            // response.redirect('/login');
            response.status(404);
            response.json({error:"이메일과 비밀번호를 입력해 주세요"});
        } else {
            next();
        }
    } , passport.authenticate('login-check',{
        successRedirect : '/login/success',
        failureRedirect : '/login/failure',
        failureFlash : true
    })
);

module.exports = router;
