"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addClient = addClient;
exports.removeClient = removeClient;
exports.broadcast = broadcast;
const clients = new Set();
function addClient(res) {
    clients.add(res);
}
function removeClient(res) {
    clients.delete(res);
}
function broadcast(eventName, data) {
    for (const client of clients) {
        client.write(`event: ${eventName}\n`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
}
