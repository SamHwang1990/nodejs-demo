
/*
 * GET home page.
 */

var Movie = require('./../models/Movie');

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

    function movieAdd(req,res){
        var movieName = req.params.name;
        if(movieName){
            return res.render('movie',{
                title:req.params.name+'|电影|管理|movie.me',
                label:'编辑电影:'+req.params.name,
                movie:req.params.name
            })
        }else{
            return res.render('movie',{
                title:'新增加|电影|管理|movie.me',
                label:'新增加电影',
                movie:false
            });
        }
    }

    function movieGetJson(req,res){
        Movie.findByName(req.params.name,function(err, obj){
            res.send(obj);
        });
    }

    function movieSave(req,res){
        console.log(req.body.content);
        var json = req.body.content;
        if(json._id){//update
            Movie.update(json,function(err){
                if(err){
                    res.send({'success':false,'err':err});
                }else{
                    res.send({'success':true});
                }
            });
        }else{//insert
            Movie.save(json,function(err){
                if(err){
                    res.send({'success':false,'err':err});
                }else{
                    res.send({'success':true});
                }
            });
        }
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

    app.get('/movie/add',[checkHadLogin,movieAdd]);
    app.get('/movie/:name',[checkHadLogin,movieAdd]);
    app.get('/movie/json/:name',[checkHadLogin,movieGetJson]);
    app.post('/movie/add',movieSave)
};