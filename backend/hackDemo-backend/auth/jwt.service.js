const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
    console.log("JWT secret key not found");
    process.exit(1);
}

function setUserToken({ id, email }) {
    return jwt.sign({
        id: id,
        email: email
    }, secretKey, { expiresIn: "7d" })
}

function decodeToken(token) {
    try {
        return jwt.verify(token, secretKey);
    }catch(err) {
        console.log("Decoding jwt token failed ...." + err);
        return null;
    }
}

module.exports = {
    setUserToken , 
    decodeToken
}