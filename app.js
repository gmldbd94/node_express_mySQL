var express = require('express');
var path = require('path');
//cookieParser: 요청된 쿠키를 쉽게 추출할 수 있도록 도와주는 미들웨어 입니다.
var cookieParser = require('cookie-parser');
// Morgan : 로그 기록을 남기는모듈
var morgan = require('morgan');
//connect-flash : 일회성 메시지들을 웹 브라우저에 나타낼때 사용하는 모듈
var flash = require('connect-flash');
//passport 모듈
const passport = require('passport');
//dotenv사용
require('dotenv').config();
const session = require('express-session');
const pageRouter = require('./routes/page');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001 );

//개발단계에서 로그를 남긴다.
app.use(morgan('dev'));
// 에러 메시지 띄우는 옵션 추가
app.use(flash());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly:true,
    secure:false,
  },
}));
app.use(express.json());

const { sequelize } =require('./models');
sequelize.sync();

//경로및 작동 관련 코드 아래쪽에 배치하는 것을 권장한다.
app.use('/', pageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
})

module.exports = app;
