exports.renderProfile = (req, res) => {
    res.render('profile', {title: '내정보 - SNS'})
};
exports.renderJoin = (req, res) => {
    res.render('join', {title: '회원가입 - SNS'})
};
exports.renderMain = (req, res,next) => {
    const twits = [];
    res.render('main', {
        title: 'SNS-Twits',
        twits,
    });
};
