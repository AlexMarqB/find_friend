import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Organization Auth E2E Test", async () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it("should authenticate an organization", async () => {
        const org = {
            cnpj: "98.436.729/0001-00",
			responsable_name: "Test Org",
			email: "testorg@example.com",
			password: "securepassword",
			whatsapp: "1234567890",
			cep: "22461-040",
			city: "Testville",
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
        }

        await request(app.server).post("/register").send(org);

        const response = await request(app.server).post("/authenticate").send({
            cnpj: "98.436.729/0001-00",
            password: "securepassword",
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            token: expect.any(String)
        }))
    })


    it("should refresh the authenticate token an organization", async () => {
        const org = {
            cnpj: "98.436.729/0001-00",
			responsable_name: "Test Org",
			email: "testorg@example.com",
			password: "securepassword",
			whatsapp: "1234567890",
			cep: "22461-040",
			city: "Testville",
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
        }

        await request(app.server).post("/register").send(org);

        const authResponse = await request(app.server).post("/authenticate").send({
            cnpj: "98.436.729/0001-00",
            password: "securepassword",
        });

        const response = await request(app.server).patch("/token/refresh").set('Authorization', `Bearer ${authResponse.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            token: expect.any(String)
        }))
    })
} )