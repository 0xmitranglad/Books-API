module.exports = function (db) {
    return {
        requireAuth: function (req, res, next) {
            let token = req.get('Auth');

            db.author.findByToken(token).then((author) => {
                req.author = author;
                next();
            }, () => {
                res.status(401).send();
            });
        }
    };
};