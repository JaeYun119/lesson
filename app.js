// express 모듈을 가져옵니다.
const express = require('express');

// cookie-parser 모듈을 가져옵니다.
const cookieParser = require('cookie-parser');

// path 모듈을 가져옵니다.
const path = require('path');

// express-session 모듈을 가져옵니다.
const session = require('express-session');

// morgan 모듈을 가져옵니다.
const morgan = require('morgan');

// nunjucks 모듈을 가져옵니다.
const nunjucks = require('nunjucks');

// dotenv 모듈을 가져옵니다.
const dotenv = require('dotenv');

//passport 모듈을 가져옵니다.
const passport = require('passport');

//권한이나 접근이라 관련있는 것들은 최대한 위에 코드작성.
//랜더링이나 데이터베이스 연결시켜주는 것들도 위에 작성.

// dotenv 패키지를 사용하여 환경 변수를 로드합니다. .env 파일에 정의된 환경 변수를 현재 환경에 로드합니다.
dotenv.config();

// 포트를 설정합니다. 환경 변수로 지정된 PORT를 사용하며, 만약 환경 변수가 설정되어 있지 않으면 기본값으로 5000을 사용합니다.
const app = express();
const passportConfig = require('./passport');
passportConfig();

app.set('port', process.env.PORT || 5000);

app.set('view engine' , 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
})

const { sequelize } = require('./models');

sequelize.sync({force:false})
.then(() => {
    console.log("데이터베이스 연결 성공")
})
.catch((err)=> {
    console.err(err)
})

// Morgan 미들웨어를 사용하여 개발 환경에서 HTTP 요청 로깅을 수행합니다.
app.use(morgan('dev'));

// Express 정적 파일 미들웨어를 설정합니다. 정적 파일들이 포함된 디렉토리를 지정하여 클라이언트에게 제공합니다. 여기서는 현재 스크립트
// 파일이 위치한 디렉토리의 'public' 폴더를 정적 파일 제공 경로로 사용합니다.
app.use(express.static(path.join(__dirname, 'public')));

// express.json() 미들웨어를 사용하여 요청 본문을 파싱하고 JSON 형식의 데이터를 추출합니다.
app.use(express.json());

// express.urlencoded() 미들웨어를 사용하여 URL-encoded 형식의 요청 본문을 파싱합니다. extended 옵션을
// false로 설정하여 querystring 모듈을 사용하여 요청 본문을 파싱합니다.
app.use(express.urlencoded({extended: false}));

// cookieParser 미들웨어를 사용하여 쿠키를 파싱하고 처리합니다. process.env.COOKIE_SECRET를 사용하여 쿠키에
// 서명합니다.
app.use(cookieParser(process.env.COOKIE_SECRET));

// session 미들웨어를 설정합니다. resave: 요청이 왔을 때 세션에 수정사항이 없더라도 세션을 다시 저장합니다.
// saveUninitialized: 세션에 저장할 내역이 없더라도 세션을 저장합니다. secret: 세션 쿠키를 서명하기 위한 키로
// process.env.COOKIE_SECRET를 사용합니다. cookie: 세션 쿠키 설정입니다.
//   - httpOnly: 클라이언트에서 쿠키를 확인 및 수정할 수 없도록 합니다.
//   - secure: HTTPS 프로토콜을 통해서만 쿠키가 전송되도록 합니다. 현재는 false로 설정되어 있습니다.
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

//설정값은 위에 배치 기능은 밑에 배치
app.use(passport.initialize());
app.use(passport.session());

// 라우터(요청처리해주는 친구) 설정
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
app.use('/', pageRouter);
app.use('/auth', authRouter);

// 404 error 처리
app.use((req, res, next) => {
    // 사용자가 요청한 URL에 해당하는 라우터가 없는 경우 404 오류를 발생시킵니다.
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 모든 error 처리 미들웨어
app.use((err, req, res, next) => {
    // 에러 메시지와 상태를 설정합니다.
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production'
        ? err
        : {};
    res.status(err.status || 500);

    // 에러 페이지를 렌더링합니다.
    res.render('error');
});

// server port 연결
const PORT = app.get('port');
app.listen(PORT, () => {
    console.log(`${PORT}번 포트 Server running`);
});
