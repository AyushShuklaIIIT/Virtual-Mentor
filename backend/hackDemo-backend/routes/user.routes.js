const express = require("express");
const {userRegister} = require("../controllers/userRegister.controller")
const {userLogin , getUserInfo} = require("../controllers/userLogin.controller");
const {userLogout} = require("../controllers/userLogout.controller")
const {authMiddleware} = require("../middleware/authMiddleware")

const userRouter = express.Router();

userRouter.post("/register", userRegister)
userRouter.post("/login", userLogin)
userRouter.post("/logout", userLogout)
userRouter.get("/info",authMiddleware, getUserInfo);

module.exports = {
    userRouter
}