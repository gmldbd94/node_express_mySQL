exports.isLoggedIn = (req, res, next) => {
    //passport모듈을 추가 했기 때문에 isAUthenticated의 메서드를 이용하여 user의 로그인 유무를 확인할 수 있습니다.
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("로그인필요");
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
}