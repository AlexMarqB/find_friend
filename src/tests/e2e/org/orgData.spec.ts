import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { RegisterAndAuthOrg } from "../registerAndAuthOrg";

describe("Org Data E2E Test", async () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it("should get the data from an organization", async () => {
        const {token} = await RegisterAndAuthOrg(app);

        const response = await request(app.server).get(`/org`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.org).toEqual(expect.objectContaining({
            cnpj: "98436729000100",
			responsable_name: "Test Org",
        }));
    })
} )