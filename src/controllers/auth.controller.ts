import { Request, Response } from "express"
import { prisma } from "../services/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
}

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie("civictrack_token")
  res.json({ message: "Logged out" })
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    res.json({ message: "User created", user })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    res.cookie("civictrack_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}