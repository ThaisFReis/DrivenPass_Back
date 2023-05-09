"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogOut = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("./errors");
const prisma_utils_1 = require("../../utils/prisma-utils");
const user_repository_1 = __importDefault(require("../../repositories/user-repository/index"));
const session_repository_1 = __importDefault(require("../../repositories/session-repository/index"));
async function SignIn(params) {
    const { email, password } = params;
    // Check if user exists
    const user = await user_repository_1.default.findUserByEmail(email, { id: true, email: true, password: true });
    if (!user)
        throw (0, errors_1.invalidCredentialsError)();
    await validatePasswordOrFail(password, user.password);
    const token = await createSession(user.id);
    const result = {
        user: (0, prisma_utils_1.exclude)(user, 'password'),
        token,
    };
    return result;
}
// Create a session
async function createSession(userId) {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    // Create a session with the token, user id, created at and expires at 1h
    await session_repository_1.default.createSession({
        token,
        userId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600),
    });
    return token;
}
// Log out
async function LogOut(userId, token) {
    if (!token)
        throw (0, errors_1.invalidCredentialsError)();
    // Search for the session
    const session = await session_repository_1.default.findSessionByToken(token, { id: true, userId: true });
    // If the session does not exist, throw an error
    if (!session)
        throw (0, errors_1.invalidCredentialsError)();
    // If the session exists, check if the user id matches
    if (session.userId !== userId)
        throw (0, errors_1.invalidCredentialsError)();
    // Delete the session
    return await session_repository_1.default.deleteSessionByToken(token);
}
exports.LogOut = LogOut;
// Delete a session
async function deleteSession(userId, token) {
    // Search for the session
    const session = await session_repository_1.default.findSessionByToken(token, { id: true, userId: true });
    // If the session does not exist, throw an error
    if (!session)
        throw (0, errors_1.invalidCredentialsError)();
    // If the session exists, check if the user id matches
    if (session.userId !== userId)
        throw (0, errors_1.invalidCredentialsError)();
    // Check if the time has expired
    const now = new Date();
    // If the date now is greater than the expiration date, delete the session
    if (now.getTime() > session.expiresAt.getTime()) {
        await session_repository_1.default.deleteSessionByToken(token);
        throw (0, errors_1.invalidCredentialsError)();
    }
    // If the date is less than the expiration date, return the session
    return session;
}
async function validatePasswordOrFail(password, userPassword) {
    const isPasswordValid = await bcrypt_1.default.compare(password, userPassword);
    if (!isPasswordValid)
        throw (0, errors_1.invalidCredentialsError)();
}
const authenticationService = {
    SignIn,
    deleteSession,
    LogOut
};
exports.default = authenticationService;
__exportStar(require("./errors"), exports);
