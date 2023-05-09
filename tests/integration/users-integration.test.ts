import app, { init } from "@/app";
import { cleanDatabase } from "../helpers";
import userService from "@/services/users-service";
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
// -- Quando o email já está em uso
// - Quando a senha é inválida
// -- Quando a senha é nula
// -- Quando a senha é inválida
// - Quando o usuário é criado com sucesso

describe('POST /register', () => {
    describe('when email is invalid', () => {
        it('should return 400 when email is null', async () => {
            const email = "";
            const password = faker.internet.password();

            const response = await server.post('/register').send({ email, password });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should return 400 when email is invalid', async () => {
            const email = "invalid-email";
            const password = faker.internet.password();

            const response = await server.post('/register').send({ email, password });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should return 409 when email is already in use', async () => {
            const user = {
                email: "johnsmith@gmail.com",
                password: faker.internet.password(6),
            };

            await userService.createUser(user);

            const response = await server.post('/register').send(user);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });
    });

    describe('when password is invalid', () => {
        it('should return 400 when password is null', async () => {
            const email = faker.internet.email();
            const password = "";

            const response = await server.post('/register').send({ email, password });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should return 400 when password is invalid', async () => {
            const email = faker.internet.email();
            const password = "123";

            const response = await server.post('/register').send({ email, password });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });
    });

    describe('when user is created successfully', () => {
        it('should return 201 when user is created successfully', async () => {
            const email = faker.internet.email();
            const password = faker.internet.password(6);

            const response = await server.post('/register').send({ email, password });

            expect(response.status).toBe(httpStatus.CREATED);
        });
    });
});