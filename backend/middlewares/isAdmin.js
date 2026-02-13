import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Admin Middleware Token: ", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token in isAdmin Middleware: ", decoded);

    User.findById(decoded.userId).then(user => {
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        // console.log("User in isAdmin Middleware: ", user);
        checkAdminRole(req, res, next);
    }).catch(err => {
        return res.status(500).json({ message: "Internal server error" });
    });
};


const checkAdminRole = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
};

export default isAdmin;