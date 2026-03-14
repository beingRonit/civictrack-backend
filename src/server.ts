import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes"
import ticketRoutes from "./routes/ticket.routes"
import sseRoutes from "./routes/sse.routes"

const app = express()

app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.FRONTEND_URL,
      "http://localhost:3000"
    ];
    if (!origin || allowed.some(o => origin.startsWith(o?.replace(/\/$/, '') ?? '')) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/sse", sseRoutes)

app.get("/", (req, res) => {
  res.send("CivicTrack API running")
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
