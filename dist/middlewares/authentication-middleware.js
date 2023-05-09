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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jwt = __importStar(require("jsonwebtoken"));
const errors_1 = require("../errors/index");
const config_1 = require("../config/index");
// Check if the user is authenticated
async function authenticate(req, res, next) {
    // Get the token from the header
    const authHeader = req.header('Authorization');
    if (!authHeader)
        res.status(http_status_1.default.UNAUTHORIZED).send((0, errors_1.unauthorizedError)());
    const token = authHeader.split(' ')[1];
    if (!token)
        return res.status(http_status_1.default.UNAUTHORIZED).send((0, errors_1.unauthorizedError)());
    // Verify the token
    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const session = await config_1.prisma.session.findFirst({
            where: {
                token,
            },
        });
        if (!session)
            res.status(http_status_1.default.UNAUTHORIZED).send((0, errors_1.unauthorizedError)());
        // If the token is valid, set the userId in the request object
        req.userId = userId;
        return next();
    }
    catch (err) {
        res.status(http_status_1.default.UNAUTHORIZED).send((0, errors_1.unauthorizedError)());
    }
}
exports.authenticate = authenticate;
