var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var app = express();

// 設定 template engine
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// body, session 設定
app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport 初始化
app.use(passport.initialize());

// passport 使用 session，所以你一定要裝 session 的 module
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {

        // 模擬你自己的帳號密碼
        const fakeUserName = 'Simon';
        const fakePassword = 'abc123';

        // 驗證傳入的帳號密碼是否正確
        if(username !== fakeUserName) {
            return done(null, false);
        }
        if(password !== fakePassword) {
            return done(null, false);
        }
        const userObject = {
            name: username,
            password: password
        };
        console.log('step 1');
        return done(null, userObject);
    }
));

// 將你的 user 資料傳入 session
passport.serializeUser(function(user, done) {
    return done(null, user.name);
});

// 每次都會檢查 session
passport.deserializeUser(function(name, done) {
    return done(null, name);
});

// login 畫面 (router)
app.get('/login', function (req, res) {
    res.render('login.html');
});

// login 後的處理
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/fail'
    })
);

// 成功的時候要做什麼
app.get('/success', function(req, res) {
    var name = req.session.passport.user;
    console.log(req.session);
    res.send('success ' + name);
});

// 失敗的時候要做什麼
app.get('/fail', function(req, res) {
    res.send('fail');
});


var server = app.listen(3000, function () {
    console.log('Example app listening 3000');
});