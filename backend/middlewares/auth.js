import jwt from "jsonwebtoken";

const auth = (req,res,next) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Error in auth js" , error);
        return res.send("Invalid Token")
    }
}

export default auth;