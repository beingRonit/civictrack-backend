import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
  id: string
  role: string
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]
  } else if ((req as any).cookies?.civictrack_token) {
    token = (req as any).cookies.civictrack_token
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    ;(req as any).user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).user?.role
  if (role !== "ADMIN" && role !== "admin") {
    return res.status(403).json({ message: "Admin access required" })
  }
  next()
}
