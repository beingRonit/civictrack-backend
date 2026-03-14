"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketApproval = exports.updateTicketStatus = exports.getTicketById = exports.getTickets = exports.createTicket = exports.updateTicketPriority = void 0;
const prisma_1 = require("../services/prisma");
const sseClients_1 = require("../services/sseClients");
const updateTicketPriority = async (req, res) => {
    try {
        const { priority } = req.body;
        const ticket = await prisma_1.prisma.ticket.update({
            where: { id: req.params.id },
            data: { priority }
        });
        await prisma_1.prisma.activity.create({
            data: {
                ticketId: ticket.id,
                message: `Priority changed to ${priority}`
            }
        });
        (0, sseClients_1.broadcast)("ticket-updated", { id: ticket.id, priority });
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateTicketPriority = updateTicketPriority;
const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority, location, latitude, longitude } = req.body;
        const userId = req.user.id;
        const ticket = await prisma_1.prisma.ticket.create({
            data: { title, description, category, priority, location, latitude, longitude, userId }
        });
        (0, sseClients_1.broadcast)("ticket-updated", { id: ticket.id, title: ticket.title });
        res.status(201).json(ticket);
    }
    catch (error) {
        console.error("createTicket error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createTicket = createTicket;
const getTickets = async (req, res) => {
    try {
        const user = req.user;
        const tickets = user.role === "ADMIN"
            ? await prisma_1.prisma.ticket.findMany({ include: { activities: true, user: true } })
            : await prisma_1.prisma.ticket.findMany({
                where: { userId: user.id },
                include: { activities: true, user: true }
            });
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getTickets = getTickets;
const getTicketById = async (req, res) => {
    try {
        const ticket = await prisma_1.prisma.ticket.findUnique({
            where: { id: req.params.id },
            include: { activities: true, user: true }
        });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getTicketById = getTicketById;
const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await prisma_1.prisma.ticket.update({
            where: { id: req.params.id },
            data: { status }
        });
        await prisma_1.prisma.activity.create({
            data: {
                ticketId: ticket.id,
                message: `Status changed to ${status}`
            }
        });
        (0, sseClients_1.broadcast)("ticket-updated", { id: ticket.id, status });
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateTicketStatus = updateTicketStatus;
const updateTicketApproval = async (req, res) => {
    try {
        const { approval } = req.body;
        const ticket = await prisma_1.prisma.ticket.update({
            where: { id: req.params.id },
            data: { approval }
        });
        await prisma_1.prisma.activity.create({
            data: {
                ticketId: ticket.id,
                message: `Approval set to ${approval}`
            }
        });
        (0, sseClients_1.broadcast)("ticket-updated", { id: ticket.id, approval });
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateTicketApproval = updateTicketApproval;
