import express from 'express';
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', async (req,res) => {
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
        res.cookie("token" , token);
        res.status(201).json({message : "User Created Successfully"});
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
    res.cookie("token" , token)
    res.status(200).json({message : "User Logged in Successfully"});
}) 



router.get('/profile', auth,  async (req,res) => {
    const id = req.userId;
    try {
        const user = await User.findById(id);
        if(!user) return res.json({message : "User Not Found"});
        user.password = undefined
        return res.json({"user" : user})
    } catch (error) {
        return res.json({message : "Internal Server Error"});
        console.log(error)
    }
})


router.put('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;

        await user.save();

        return res.status(200).json({ message: "User Profile Updated" });

    } catch (error) {
        console.log("Error in Profile Update:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



router.patch('/profile' , auth , async (req,res) => {
    const id = req.userId;
    try {
        const user = await User.findById(id);
        if(!user) return res.json({message : "User not found"});

        const allowedUpdates = ["email" , "password" , "name"];
        const updates = Object.keys(req.body);

        const isValidOperation = updates.every((field) => allowedUpdates.includes(field));
        if(!isValidOperation) return res.status(400).json({message : "Invalid update fields"});


        updates.forEach((key) => {
            user[key] = req.body[key];
        });

        await user.save();

        return res.status(200).json({message : "User Profile Updated"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"});
    }
})



export default router;