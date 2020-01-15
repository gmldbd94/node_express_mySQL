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
const passportConfig = require('./passport');
//dotenv사용
require('dotenv').config();
const session = require('express-session');
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
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

const { sequelize } = require('./models');
// // 데이터 모델 변경 확인
// sequelize.sync();
passportConfig(passport);

//passport.initialize는 미들웨어 요청(req 객체)에 passport 설정을 심는다.
app.use(passport.initialize());

//passport.session는 req.session객체에 passport 정보를 저장합니다. 
//req.session 객체에 express-session에서 생성하는 것이므로 express-session 미들웨어보다 뒤에 연결해야합니다.
app.use(passport.session());

//경로 및 작동 관련 코드 아래쪽에 배치하는 것을 권장한다.
app.use('/', pageRouter);
app.use('/auth', authRouter);

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
