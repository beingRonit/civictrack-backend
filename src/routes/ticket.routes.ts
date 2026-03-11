import { Router } from "express"
import { verifyToken, isAdmin } from "../middleware/auth.middleware"
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  updateTicketApproval
} from "../controllers/ticket.controller"

const router = Router()

router.post("/", verifyToken, createTicket)
router.get("/", verifyToken, getTickets)
router.get("/:id", verifyToken, getTicketById)
router.patch("/:id/status", verifyToken, isAdmin, updateTicketStatus)
router.patch("/:id/approval", verifyToken, isAdmin, updateTicketApproval)

export default router
