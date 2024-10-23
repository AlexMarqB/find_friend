import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Register Organization E2E Test", async () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it("should register an organization", async () => {
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

        const response = await request(app.server).post("/register").send(org);

        expect(response.status).toBe(201);
    })
} )