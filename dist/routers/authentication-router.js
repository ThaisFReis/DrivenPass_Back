"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authentication_controller_1 = require("../controllers/authentication-controller");
const authentication_middleware_1 = require("../middlewares/authentication-middleware");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter
    .post('/login', authentication_controller_1.SignIn)
    .post('/logout', authentication_middleware_1.authenticate, authentication_controller_1.LogOut);
