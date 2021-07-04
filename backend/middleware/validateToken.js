const jwt = require('jsonwebtoken');

const validatetoken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(500).send({ message: "Token not provided" });
        } else {
            // console.log('okiju');
            const token = req.headers.authorization.split(" ")[1];
            const userinfo = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(userinfo);
            if (!userinfo) {
                return res.status(500).send({ message: "Token not provided" });
            }
            req.user = userinfo;
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Token is expire or invalid" });
    }
}

module.exports = validatetoken;