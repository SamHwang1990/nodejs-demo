
/*
 * GET home page.
 */

module.exports = function(app){

    function checkNotLogin(req,res,next){
        if(req.session.user){
           req.session.error = '已登录';
            return res.redirect('/home');
        }
        next();
    }

    function checkHadLogin(req,res,next){
        if(!req.session.user){
            req.session.error = '请先登录';
            return res.redirect('/login');
        }
        next();
    }


    app.get('/',function(req,res){
        res.render('index',{title:'Nodejs-Demo'});
    });

    app.all('/login',checkNotLogin);
    app.get('/login',function(req,res){
        res.render('login',{title:'Login-Nodejs-Demo'});
    });

    app.post('/login',function(req,res){
        var adminUser = {
            UserName:'admin',
            UserPassword:'admin'
        };
        if(req.body.UserName === adminUser.UserName && req.body.UserPassword === adminUser.UserPassword){
            //将当前用户信息存入session对象中
            req.session.user = adminUser;
            res.redirect('/home');
        }
        else{
            req.session.error = '用户名或密码不正确';
            res.redirect('/login');
        }

    });

    app.get('/logout',checkHadLogin);
    app.get('/logout',function(req,res){
        //清空session.user的内容
        req.session.user = null;
        res.redirect('/');
    });

    app.get('/home',checkHadLogin);
    app.get('/home',function(req,res){
        res.render('home',{title:'Home-Nodejs-Demo'});
    });

};