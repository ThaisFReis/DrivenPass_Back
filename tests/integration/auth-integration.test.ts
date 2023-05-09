import app, { init } from "@/app";
import { cleanDatabase } from "../helpers";
import userService from "@/services/users-service";
import authenticationService from "@/services/authentication-service";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";

beforeAll(async () => {
    await init();
    await cleanDatabase();
});

const server = supertest(app);

// Os testes que precisam ser feitos:
// - Quando o email é inválido
// -- Quando o email é nulo
// -- Quando o email é inválido
// - Quando a senha é inválida
// -- Quando a senha é nula
// -- Quando a senha é inválida
// -- Quando a senha está incorreta
// - Quando o input é válido
// -- Quando o usuário é autenticado com sucesso


describe('POST /login', () => {
    describe('when email is invalid', () => {
        it('should return 400 when email is null', async () => {
            const email = "";
            const password = faker.internet.password();

            const response = await server.post('/login').send({ email, password });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should return 400 when email is invalid', async () => {
            const email = "invalid-email";
            const password = faker.internet.password();

            const response = await server.post('/login').send({ email, password });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        })
    });
        
    describe('when password is invalid', () => {
        it('should return 400 when password is null', async () => {
            const email = faker.internet.email();
            const password = "";

            const response = await server.post('/login').send({ email, password });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });
    });

    describe('when input is valid', () => {
        it('should return 200 when user is authenticated', async () => {
            const user = {
                email: faker.internet.email(),
                password: faker.internet.password(6),
            };

            await userService.createUser(user);

            const response = await server.post('/login').send(user);

            expect(response.status).toBe(httpStatus.OK);
        });
    });
});

describe('POST /logout', () => {
    describe('when user is not authenticated', () => {
        it('should return 401 when user is not authenticated', async () => {
            const response = await server.post('/logout');

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });
    });

    describe('when user is authenticated', () => {
        it('should return 200 when user is authenticated', async () => {
            const user = {
                email: faker.internet.email(),
                password: faker.internet.password(6),
            };

            await userService.createUser(user);

            const loginResponse = await server.post('/login').send(user);

            const { token } = loginResponse.body.token;

            await server.post('/logout').set('Authorization', `Bearer ${token}`);

            expect(loginResponse.status).toBe(httpStatus.OK);
        });
    });
});