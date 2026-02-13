import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from "./controllers/user.controller.js";
import adminRouter from "./controllers/admin.controller.js";
import cookieParser from 'cookie-parser'
import customCookieParser from './config/CookieParser.js'


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser())

connectDB();

app.use('/api/auth', userRouter);
app.use('/api/admin' , adminRouter);



app.get('/' , (req,res) => {
    console.log(req.headers.cookie)
    console.log(customCookieParser(req.headers.cookie))
    res.send('Server is up and running'); 
})


app.get('/name/:name' , (req,res) => {
    const name = req.params.name;
    res.cookie("name" , name);
    res.cookie("lastname" , "jain");
    res.cookie("lastName" , "JAIN");
    res.send(`Your name is ${name}`);
})

app.get('/delcookie' , (req,res) => {
    res.clearCookie("name");
    res.send("Cookie Deleted")
})

app.get('/search' , (req,res) => {
    const {name , lastname} = req.query;
    res.send(`Your first name is ${name} and last name is ${lastname}`)
})
  

app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + 'http://localhost:'+ process.env.PORT);
})