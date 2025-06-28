const express = require("express");
const taskRouter = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware")
const {
    addTask , 
    deleteTask , 
    updateTask , 
    getSuggestions , 
    getAllTasks, 
    getTaskByIdSingle,
    updateStatus,
} = require("../controllers/tasks.controller");

taskRouter.use(authMiddleware);

taskRouter.post("/add", addTask);

taskRouter.delete("/delete/:id", deleteTask);

taskRouter.patch("/update/:id", updateTask);

taskRouter.patch("/updateStatus/:id" , updateStatus);

taskRouter.get("/getall", getAllTasks);

taskRouter.get("/get/:id" , getTaskByIdSingle);

taskRouter.get("/suggestions", getSuggestions);

module.exports= {
    taskRouter
}