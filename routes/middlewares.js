const SendJson = require('../module/SendJson');
const statusCode = require('../module/statusCode');
exports.isLoggedIn = (req, res, next) => {
    //passport모듈을 추가 했기 때문에 isAUthenticated의 메서드를 이용하여 user의 로그인 유무를 확인할 수 있습니다.
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send(SendJson.successFalse("로그인하세요!"));
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    }else{
        res.status(statusCode.FORBIDDEN).send(SendJson.successFalse("현재 로그인이 되어있습니다."));
    }
}