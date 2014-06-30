
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs'),
    SessionStore = require('session-mongoose')(express);

//配置Session数据的存储位置
var sessionStore = new SessionStore({
    url:"mongodb://localhost/session-NodeDemo",
    interval:120000
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('.html',ejs.__express);
app.set('view engine', 'html');//app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
//app.use(express.cookieSession({secret:'ssyog'}));
app.use(express.session({
    secret:'ssyog',
    store:sessionStore,
    cookie:{maxAge:900000}
}));
app.use(function(req,res,next){
    //将session的user信息传导locals这个视图全局变量中
    res.locals.user = req.session.user;

    //将error信息传导到locals变量中
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if(err)
        res.locals.message = '<div class="alert alert-error">'+ err + '</div> '

    next();
})
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//路径解析
routes(app);

//启动及端口
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
