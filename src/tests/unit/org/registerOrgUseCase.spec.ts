import { OrgInMemoryRepository } from "@/domain/in-memory-repositories/OrgInMemoryRepository";
import { OrgRepository } from "@/repositories/orgRepository";
import { RegisterOrgUseCase } from "@/domain/use-cases/org/registerOrgUseCase";
import { InvalidDataError } from "@/errors/InvalidDataError";
import { Org } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

let sut: RegisterOrgUseCase;
let repository: OrgRepository;

describe("registerOrgUseCase unit test", async () => {
	beforeEach(async () => {
		repository = new OrgInMemoryRepository();
		sut = new RegisterOrgUseCase(repository);
	});

	it("Should be able to register a new org", async () => {
		const org: Org = {
			id: "1",
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
		};

		const response = await sut.execute(org);

		expect(response.org).toEqual(
			expect.objectContaining({ id: expect.any(String) })
		);
	});

	it("Should not be able to register a new org with an existing cnpj", async () => {
		const org1: Org = {
			id: "1",
			cnpj: "98.436.729/0001-00",
			responsable_name: "Test Org 1",
			email: "testorg1@example.com",
			password: "securepassword1",
			whatsapp: "1234567890",
			cep: "22461-040",
			city: "Testville",
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
		};

		const org2: Org = {
			id: "2",
			cnpj: "98.436.729/0001-00",
			responsable_name: "Test Org 2",
			email: "testorg2@example.com",
			password: "securepassword2",
			whatsapp: "0987654321",
			cep: "22461-040",
			city: "Testville",
			street: "456 Test Ave",
			neighborhood: "Test Neighborhood",
			number: "456",
		};

		await sut.execute(org1);

		await expect(sut.execute(org2)).rejects.toBeInstanceOf(InvalidDataError);
	});

	it("Should not be able to register a new org with an invalid cnpj", async () => {
		const org: Org = {
			id: "1",
			cnpj: "98.436.729/0001-01",
			responsable_name: "Test Org",
			email: "testorg@example.com",
			password: "securepassword",
			whatsapp: "1234567890",
			cep: "22461-040",
			city: "Testville",
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
		};

		await expect(sut.execute(org)).rejects.toBeInstanceOf(InvalidDataError);
	});

    it("Should not be able to register a new org with an invalid cep", async () => {
        const org: Org = {
            id: "1",
            cnpj: "98.436.729/0001-00",
            responsable_name: "Test Org",
            email: "testorg@example.com",
            password: "securepassword",
            whatsapp: "1234567890",
            cep: "invalid-cep",
            city: "Testville",
            street: "123 Test St",
            neighborhood: "Test Neighborhood",
            number: "123",
        }

        await expect(sut.execute(org)).rejects.toBeInstanceOf(InvalidDataError);
    })
});