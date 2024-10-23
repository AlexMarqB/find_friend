import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { RegisterAndAuthOrg } from "../registerAndAuthOrg";
import { EnergyLevel, Size } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe("List Pets Controller E2E Test", async () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		await prisma.pet.deleteMany({});
		await prisma.org.deleteMany({});
	});

	it("should list pets by city with filters", async () => {
		const { token } = await RegisterAndAuthOrg(app);

		// Criação de 2 organizações em cidades diferentes com CNPJ único
		const org1 = await prisma.org.create({
			data: {
				cnpj: "70.174.959/0001-29",
				responsable_name: "Org1",
				email: "org1@example.com",
				password: "securepassword",
				whatsapp: "1234567890",
				cep: "22461-040",
				city: "CityA",
				street: "123 Test St",
				neighborhood: "Test Neighborhood",
				number: "123",
			},
		});

		const org2 = await prisma.org.create({
			data: {
				cnpj: "40.993.298/0001-00",
				responsable_name: "Org2",
				email: "org2@example.com",
				password: "securepassword",
				whatsapp: "0987654321",
				cep: "22461-041",
				city: "CityB",
				street: "456 Test Ave",
				neighborhood: "Test Neighborhood 2",
				number: "456",
			},
		});

		// Criação de pets para org1
		await prisma.pet.createMany({
			data: [
				{
					about: "Friendly and playful",
					adopted: false,
					age: 2,
					breed: "Labrador",
					energy_level: EnergyLevel.HIGH,
					name: "Buddy",
					size: Size.LARGE,
					adoption_requirements:
						"Requires a large yard and daily exercise",
					org_id: org1.id,
				},
				{
					about: "Shy and quiet",
					adopted: false,
					age: 3,
					breed: "Beagle",
					energy_level: EnergyLevel.MEDIUM,
					name: "Max",
					size: Size.MEDIUM,
					adoption_requirements: "Needs a calm environment",
					org_id: org1.id,
				},
			],
		});

		// Criação de pets para org2
		await prisma.pet.createMany({
			data: [
				{
					about: "Playful and energetic",
					adopted: false,
					age: 1,
					breed: "Poodle",
					energy_level: EnergyLevel.HIGH,
					name: "Charlie",
					size: Size.SMALL,
					adoption_requirements: "Loves to play with kids",
					org_id: org2.id,
				},
				{
					about: "Calm and relaxed",
					adopted: false,
					age: 4,
					breed: "Bulldog",
					energy_level: EnergyLevel.LOW,
					name: "Rocky",
					size: Size.LARGE,
					adoption_requirements: "Needs short walks",
					org_id: org2.id,
				},
			],
		});

		// Testando o filtro por cidade (org1)
		const responseCityA = await request(app.server)
			.get(`/pets/list/${org1.city}`)
			.set("Authorization", `Bearer ${token}`);

		expect(responseCityA.status).toBe(200);
		expect(responseCityA.body.pets).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "age": 2,
                    "name": "Buddy",
                    "size": "LARGE",
                }),
                expect.objectContaining({
                    "age": 3,
                    "name": "Max",
                    "size": "MEDIUM",
                }),
            ])
        );

		// Testando o filtro por cidade (org2)
		const responseCityB = await request(app.server)
			.get(`/pets/list/${org2.city}`)
			.set("Authorization", `Bearer ${token}`);

		expect(responseCityB.status).toBe(200);
		expect(responseCityB.body.pets).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "Charlie",
					age: 1,
					size: Size.SMALL,
				}),
				expect.objectContaining({
					name: "Rocky",
					age: 4,
					size: Size.LARGE,
				}),
			])
		);
	});

	it("should filter pets by size", async () => {
		const { token } = await RegisterAndAuthOrg(app);

		// Criação de 2 organizações em cidades diferentes com CNPJ único
		const org3 = await prisma.org.create({
			data: {
				cnpj: "90.929.829/0001-66", // CNPJ único e válido
				responsable_name: "Org3",
				email: "org3@example.com",
				password: "securepassword",
				whatsapp: "1122334455",
				cep: "22461-042",
				city: "CityC",
				street: "789 Test Rd",
				neighborhood: "Test Neighborhood 3",
				number: "789",
			},
		});

		const org4 = await prisma.org.create({
			data: {
				cnpj: "32.127.302/0001-11", // CNPJ único e válido
				responsable_name: "Org4",
				email: "org4@example.com",
				password: "securepassword",
				whatsapp: "9988776655",
				cep: "22461-043",
				city: "CityD",
				street: "101 Test Blvd",
				neighborhood: "Test Neighborhood 4",
				number: "101",
			},
		});

		// Criação de pets para org3
		await prisma.pet.createMany({
			data: [
				{
					about: "Friendly and playful",
					adopted: false,
					age: 2,
					breed: "Labrador",
					energy_level: EnergyLevel.HIGH,
					name: "Buddy",
					size: Size.LARGE,
					adoption_requirements:
						"Requires a large yard and daily exercise",
					org_id: org3.id,
				},
				{
					about: "Playful and small",
					adopted: false,
					age: 1,
					breed: "Chihuahua",
					energy_level: EnergyLevel.HIGH,
					name: "Tiny",
					size: Size.SMALL,
					adoption_requirements: "Great for apartments",
					org_id: org3.id,
				},
			],
		});

		// Criação de pets para org4
		await prisma.pet.createMany({
			data: [
				{
					about: "Calm and relaxed",
					adopted: false,
					age: 4,
					breed: "Bulldog",
					energy_level: EnergyLevel.LOW,
					name: "Rocky",
					size: Size.LARGE,
					adoption_requirements: "Needs short walks",
					org_id: org4.id,
				},
				{
					about: "Energetic and playful",
					adopted: false,
					age: 2,
					breed: "Poodle",
					energy_level: EnergyLevel.HIGH,
					name: "Fido",
					size: Size.MEDIUM,
					adoption_requirements: "Loves to run",
					org_id: org4.id,
				},
			],
		});

		// Testando o filtro por tamanho (LARGE)
		const responseLarge = await request(app.server)
			.get(`/pets/list/${org3.city}`)
			.query("size=LARGE")
			.set("Authorization", `Bearer ${token}`);

            expect(responseLarge.status).toBe(200);
            expect(responseLarge.body.pets).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        "age": 2,
                        "name": "Buddy",
                        "size": "LARGE",
                    }),
                ])
            );

		// Testando o filtro por tamanho (SMALL)
		const responseSmall = await request(app.server)
			.get(`/pets/list/${org3.city}`)
			.query("size=SMALL")
			.set("Authorization", `Bearer ${token}`);

		expect(responseSmall.status).toBe(200);
		expect(responseSmall.body.pets).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "Tiny",
					age: 1,
					size: Size.SMALL,
				}),
			])
		);
	});
});
