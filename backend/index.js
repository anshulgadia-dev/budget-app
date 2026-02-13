import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from "./controllers/user.controller.js";
import adminRouter from "./controllers/admin.controller.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

connectDB();

app.use('/api/auth', userRouter);
app.use('/api/admin' , adminRouter);



app.get('/' , (req,res) => {
    res.send('Server is up and running');   
})

app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + 'http://localhost:'+ process.env.PORT);
})