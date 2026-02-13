import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    name : {
        type: String,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    role : {
        type : String,
        enum : ['user' , 'admin'],
        default : 'user'
    }
})


userSchema.pre('save' , async function() {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password , 10);
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password);
}


export const User = mongoose.model('User', userSchema);