import db from "../models/index.js";
import authConfig from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.users;
const Role = db.ROLES;

export const signup = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const role = await Role.findOne({ where: { name: "user" } });

        await user.setRoles([role]);

        res.status(201).json({ message: "User stored successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400, // 24 hours
        });

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            accessToken: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};