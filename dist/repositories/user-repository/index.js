"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config/index");
// Create a new user
async function createUser(email, password) {
    return await config_1.prisma.user.create({
        data: {
            email,
            password,
        },
    });
}
// Find a user by email
async function findUserByEmail(email, select) {
    const user = {
        where: {
            email,
        },
    };
    if (select) {
        user.select = select;
    }
    return await config_1.prisma.user.findUnique(user);
}
// Find a user by id
async function findUserById(id) {
    return await config_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
}
const UserRepository = {
    createUser,
    findUserByEmail,
    findUserById,
};
exports.default = UserRepository;
