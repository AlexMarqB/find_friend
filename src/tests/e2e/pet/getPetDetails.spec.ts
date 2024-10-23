import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { RegisterAndAuthOrg } from "../registerAndAuthOrg";
import { EnergyLevel, Size } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe("Get Pet Details E2E Test", async () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should get a pet", async () => {
		const { token } = await RegisterAndAuthOrg(app);

		const org = await prisma.org.findFirstOrThrow();

		const petData = {
			about: "Friendly and playful",
			adopted: false,
			age: 2,
			breed: "Labrador",
			energy_level: EnergyLevel.HIGH,
			name: "Buddy",
			size: Size.LARGE,
			adoption_requirements: "Requires a large yard and daily exercise",
		};

		await request(app.server)
			.post(`/pets/register`)
			.send(petData)
			.set("Authorization", `Bearer ${token}`);

		const pet = await prisma.pet.findFirstOrThrow();

		const response = await request(app.server)
			.get(`/pets/${pet.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.pet).toEqual(
			expect.objectContaining({
                name: "Buddy",
                age: 2,
			}));
	});
});
