"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config/index");
// Create a session
async function createSession(data) {
    return config_1.prisma.session.create({
        data,
    });
}
// Find a session by token
async function findSessionByToken(token, select) {
    const session = {
        where: {
            token,
        },
    };
    if (select) {
        session.select = select;
    }
    return await config_1.prisma.session.findUnique(session);
}
// Delete a session by token
async function deleteSessionByToken(token) {
    return await config_1.prisma.session.delete({
        where: {
            token,
        },
    });
}
const SessionRepository = {
    createSession,
    findSessionByToken,
    deleteSessionByToken,
};
exports.default = SessionRepository;
