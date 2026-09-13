import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            $or: [ { email }, { username } ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User with this email or username already exists",
                success: false,
                err: "User already exists"
            })
        }

        const user = await userModel.create({ username, email, password })

    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <h3><a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a></h3>

                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            success: false,
            err: err.message
        })
    }

}


export async function verifyEmail(req, res) {
    const {token} = req.query;

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user =  await userModel.findOne({email:decode.email});

        if(user == false){
            res.status(400).json({
                message:"Invalide user",
                success:"false",
                err:"user not found"
            })
        }

        user.verified = true;
        await user.save();

        const html=`
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:3000/login">Go to Login</a>
        `

        return res.send(html);

    }
    catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}


export async function login(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(user ==  false){
        res.status(400).json({
            message:"Invalid user",
            success:"false",
            err:"User not found"
        })
    }

    const isPassword = await user.comparePassword(password);

    if(isPassword == false){
        res.status(400).json({
            message:"Invalid email or passowrd",
            success:"false",
            err:"Invalid cedintial"

        })
    }

    if(user.verified == false){
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }


    const token = jwt.sign({
        id:user._id,
        email:user.email
    }, process.env.JWT_SECRET, 
{expiresIn:"1d"});

    res.cookie("token", token);

     res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

       
}


export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}
