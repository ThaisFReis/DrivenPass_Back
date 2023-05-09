"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailExists = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const user_repository_1 = __importDefault(require("../../repositories/user-repository/index"));
async function createUser({ email, password }) {
    // Check if email is already in use
    await emailExists(email);
    // Hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // Create user
    const user = await user_repository_1.default.createUser(email, hashedPassword);
    return user;
}
exports.createUser = createUser;
const UserService = {
    createUser,
};
async function emailExists(email) {
    const user = await user_repository_1.default.findUserByEmail(email);
    if (user) {
        throw {
            status: http_status_1.default.CONFLICT,
            message: 'Email already in use',
        };
    }
}
exports.emailExists = emailExists;
exports.default = UserService;
