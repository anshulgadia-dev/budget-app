import express from 'express';
import isAdmin from '../middlewares/isAdmin.js';
const router = express.Router();
import { User } from '../models/user.model.js';


router.get('/users' , isAdmin , async (req , res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message: "Error fetching users"});
    }
})

export default router;