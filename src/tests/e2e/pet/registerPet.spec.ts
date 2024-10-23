import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { RegisterAndAuthOrg } from "../registerAndAuthOrg";
import { EnergyLevel, Size } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe("Register Pet E2E Test", async () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it("should register a pet", async () => {
        const {token} = await RegisterAndAuthOrg(app);

        const org = await prisma.org.findFirstOrThrow()
 
        const pet = {
            about: "Friendly and playful",
            adopted: false,
            age: 2,
            breed: "Labrador",
            energy_level: EnergyLevel.HIGH,
            name: "Buddy",
            size: Size.LARGE,
            adoption_requirements: "Requires a large yard and daily exercise"
        };

        const response = await request(app.server).post(`/pets/register`).send(pet).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
    })
} )