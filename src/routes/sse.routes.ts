import { Router } from "express"
import { addClient, removeClient } from "../services/sseClients"

const router = Router()

router.get("/", (req, res) => {
  // Required SSE headers
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()

  // Heartbeat every 30s to prevent proxy timeouts
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n")
  }, 30000)

  addClient(res)

  req.on("close", () => {
    clearInterval(heartbeat)
    removeClient(res)
  })
})

export default router
