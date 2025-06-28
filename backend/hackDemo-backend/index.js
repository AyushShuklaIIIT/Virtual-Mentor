require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const PORT = process.env.PORT || 8000;
const app = express();
require("./initDB")

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const { userRouter } = require("./routes/user.routes");
const { authMiddleware } = require("./middleware/authMiddleware");
const { taskRouter } = require("./routes/task.routes");

app.get("/health",(req,resp)=>{
    return resp.json({message : "health-check"});
})

app.use("/api/user",userRouter);
app.use("/api/task",taskRouter);

app.get("/test",authMiddleware,(req,resp)=>{
    console.log("Middle ware worked ...." + req.user.id + "  " + req.user.email);
    console.log(req.user);
    return resp.status(200).json({message : "Hello" , email: req.user.email});
})


app.listen(PORT, ()=>{
    console.log(">Server started at port " + PORT);
})