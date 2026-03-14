"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.logoutUser = exports.getMe = void 0;
const prisma_1 = require("../services/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getMe = getMe;
const logoutUser = (_req, res) => {
    res.clearCookie("civictrack_token");
    res.json({ message: "Logged out" });
};
exports.logoutUser = logoutUser;
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        res.json({ message: "User created", user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("civictrack_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role.toLowerCase() } });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.loginUser = loginUser;
