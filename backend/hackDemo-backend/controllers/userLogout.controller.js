
function userLogout(req, resp) {
    resp.clearCookie("jwtToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production"
    });
    return resp.status(200).json({message : "Logout succesful"});
}

module.exports = {
    userLogout
}