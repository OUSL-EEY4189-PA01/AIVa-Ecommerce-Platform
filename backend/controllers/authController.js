import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js"


export const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if(userExists) {
            return res.status(400).json( {message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashPassword,
        });

        res.status(201).json({ message: "User Registerd Successfully"});


    } catch(error){
        res.status(500).json({ message: error.message });
    }
}



export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        const token = generateToken(user._id);

        if(isPasswordValid){
            res.json({token, user: {id: user._id, name: user.name, isAdmin: user.isAdmin}});
        
        }else{
            res.status(400).json({ message: "Invalid Password" });
        }

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}