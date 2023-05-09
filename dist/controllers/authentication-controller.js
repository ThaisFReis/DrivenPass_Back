"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogOut = exports.SignIn = void 0;
const http_status_1 = __importDefault(require("http-status"));
const authentication_service_1 = __importDefault(require("../services/authentication-service/index"));
const schemas_1 = require("../schemas/index");
async function SignIn(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            message: 'Email and password are required',
        });
    }
    // Check if email is valid and password is longer than 6 characters
    const { error } = schemas_1.signInSchema.validate({ email, password });
    if (error) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            message: ' Email or password are invalid',
        });
    }
    try {
        const user = await authentication_service_1.default.SignIn({ email, password });
        return res.status(http_status_1.default.OK).json(user);
    }
    catch (error) {
        if (error === 'invalidCredentialsError') {
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                message: 'Invalid credentials',
            });
        }
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
        });
    }
}
exports.SignIn = SignIn;
// Log out
async function LogOut(req, res) {
    const { userId, token } = req.body;
    if (!userId || !token) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            message: 'User id and token are required',
        });
    }
    try {
        await authentication_service_1.default.LogOut(userId, token);
        return res.status(http_status_1.default.OK).json({
            message: 'Log out successfully',
        });
    }
    catch (error) {
        if (error === 'invalidCredentialsError') {
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                message: 'Invalid credentials',
            });
        }
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
        });
    }
}
exports.LogOut = LogOut;
