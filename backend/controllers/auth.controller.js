import User from "../models/user.model.js"
import bycrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const user = new User({
            name,
            username,
            email,
            password: hashedPassword,
        })

        await user.save()

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "strict", secure: process.env.NODE_ENV === "production" })

        res.status(201).json({ message: "User created successfully" })


        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username

        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl)
        } catch (emailError) {
            console.error("Error sending welcome message", emailError)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const login = (req, res) => {
    res.send("login")
}

export const logout = (req, res) => {
    res.send("logout")
}

export default {
    signup,
    login,
    logout
}