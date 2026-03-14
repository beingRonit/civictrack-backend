import { Request, Response } from "express"
import { prisma } from "../services/prisma"
import { broadcast } from "../services/sseClients"

export const updateTicketPriority = async (req: Request, res: Response) => {
  try {
    const { priority } = req.body
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id as string },
      data: { priority }
    })
    await prisma.activity.create({
      data: {
        ticketId: ticket.id,
        message: `Priority changed to ${priority}`
      }
    })
    broadcast("ticket-updated", { id: ticket.id, priority })
    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, category, priority, location, latitude, longitude } = req.body
    const userId = (req as any).user.id

    const ticket = await prisma.ticket.create({
      data: { title, description, category, priority, location, latitude, longitude, userId }
    })

    broadcast("ticket-updated", { id: ticket.id, title: ticket.title })

    res.status(201).json(ticket)
  } catch (error) {
    console.error("createTicket error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getTickets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user

    const tickets = user.role === "ADMIN"
      ? await prisma.ticket.findMany({ include: { activities: true, user: true } })
      : await prisma.ticket.findMany({
          where: { userId: user.id },
          include: { activities: true, user: true }
        })

    res.json(tickets)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id as string },
      include: { activities: true, user: true }
    })

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body

    const ticket = await prisma.ticket.update({
      where: { id: req.params.id as string },
      data: { status }
    })

    await prisma.activity.create({
      data: {
        ticketId: ticket.id,
        message: `Status changed to ${status}`
      }
    })

    broadcast("ticket-updated", { id: ticket.id, status })

    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const updateTicketApproval = async (req: Request, res: Response) => {
  try {
    const { approval } = req.body

    const ticket = await prisma.ticket.update({
      where: { id: req.params.id as string },
      data: { approval }
    })

    await prisma.activity.create({
      data: {
        ticketId: ticket.id,
        message: `Approval set to ${approval}`
      }
    })

    broadcast("ticket-updated", { id: ticket.id, approval })

    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
