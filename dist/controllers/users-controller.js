"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_service_1 = __importDefault(require("../services/users-service/index"));
const schemas_1 = require("../schemas/index");
const user_repository_1 = __importDefault(require("../repositories/user-repository/index"));
// Sign up
async function SignUp(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            message: 'Email and password are required',
        });
    }
    // Check if email is valid and password is longer than 6 characters
    const { error } = schemas_1.createUserSchema.validate({ email, password });
    if (error) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            message: ' Email has to be a valid email and password has to be longer than 6 characters',
        });
    }
    // Check if email is already in use
    const user = await user_repository_1.default.findUserByEmail(email);
    try {
        const user = await users_service_1.default.createUser({ email, password });
        return res.status(http_status_1.default.CREATED).json({
            user: {
                id: user.id,
                email: user.email,
            },
        });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.SignUp = SignUp;
