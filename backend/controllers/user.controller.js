import express from 'express';
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/signup' , async (req,res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    const isEmailExist = await User.exists({email});
    if(isEmailExist){
        console.log("Email already exists");
        res.status(400).json({message : "Email already exists"});
        return;
    }

    try {
        const user = await User.create({name , email, password});
        const token = jwt.sign({userId : user._id} , process.env.JWT_SECRET , {expiresIn : '5m'});
        user.password = undefined;
        console.log("User created successfully");
        res.status(201).json({user, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error creating user"});
    }
})


router.post("/login" , async (req,res) => {
    const {email , password} = req.body;

    const user = await User.findOne({email}).select("+password");
    if(!user){
        res.status(400).json({message : "Invalid email or password"});
        return;
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        res.status(400).json({message : "Invalid email or password"});
        return;
    }
    
    const token = jwt.sign({userId : user._id} , process.env.JWT_SECRET , {expiresIn : '5m'});
    user.password = undefined;
    res.status(200).json({user , token});
}) 



router.get('/profile' , async (req,res) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token: ", token);
    if(!token){
        res.status(401).json({message : "Unauthorized"});
        return;
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user){
            res.status(404).json({message : "User not found"});
            return;
        }
        user.password = undefined;
        res.status(200).json({user});
    } catch (error) {
        res.status(401).json({message : "Invalid token"});
    }
})





export default router;