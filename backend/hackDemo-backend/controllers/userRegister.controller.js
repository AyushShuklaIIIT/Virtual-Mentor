const {insertUserIntoDb , getUserFromDbByEmail} = require("../models/userQueries");
const bcryptjs = require("bcryptjs");


async function userRegister(req,resp){
    try{
        const {username , email , password } = req.body;
        if(!username || !email || !password){
            return resp.status(400).json({message : "missing fields "});
        }
        
        const existingUser = await getUserFromDbByEmail(email);
        if(existingUser){
            return resp.status(409).json({message : "User Already exists"});
        }
        
        const hashedPass = await bcryptjs.hash(password , 10);
        const user = {
            username : username,
            email : email,
            password : hashedPass
        };
        const result = await insertUserIntoDb(user);
        console.log("User inserted with userID " + result);
        return resp.status(201).json({message : "User inserted ", userID : result})
    }catch(err){
        console.log("Error : ", err.message);
        return resp.status(400).json({message : "User registration failed ....."})
    }
}

module.exports = {
    userRegister
}