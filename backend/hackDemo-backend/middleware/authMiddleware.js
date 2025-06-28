const { decodeToken } = require("../auth/jwt.service");

function authMiddleware(req, resp, next) {
    try {
        const jwtToken = req.cookies?.jwtToken;
        if(!jwtToken){
            return resp.status(401).json({ message: "Missing token" });
        }
        const payload = decodeToken(jwtToken);
        if (payload == null) {
            return resp.status(401).json({ message: "User not authorized" });
        }
        req.user = {
            id : payload.id,
            email : payload.email
        }
        next()
    }catch(err){
        console.log("Error in authMiddleware "+err.message);
        return resp.status(401).json({message : "Error in authorization"})
    }
}

module.exports = {
    authMiddleware
}