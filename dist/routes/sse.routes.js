"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sseClients_1 = require("../services/sseClients");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    // Required SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    // Heartbeat every 30s to prevent proxy timeouts
    const heartbeat = setInterval(() => {
        res.write(": heartbeat\n\n");
    }, 30000);
    (0, sseClients_1.addClient)(res);
    req.on("close", () => {
        clearInterval(heartbeat);
        (0, sseClients_1.removeClient)(res);
    });
});
exports.default = router;
