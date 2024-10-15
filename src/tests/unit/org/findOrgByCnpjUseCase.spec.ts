import { OrgInMemoryRepository } from "@/domain/repositories/in-memory/OrgInMemoryRepository";
import { OrgRepository } from "@/domain/repositories/orgRepository";
import { FindOrgByCnpjUseCase } from "@/domain/use-cases/org/findOrgByCnpjUseCase";
import { InvalidDataError } from "@/errors/InvalidDataError";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { stringFormaters } from "@/utils";
import { Org } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

let sut: FindOrgByCnpjUseCase;
let repository: OrgRepository;

const formattedCnpj =
	stringFormaters.formatCnpjStringToNumber("98.436.729/0001-00");

describe("FindOrgByCnpjUseCase unit test", async () => {
	beforeEach(async () => {
		repository = new OrgInMemoryRepository();
		sut = new FindOrgByCnpjUseCase(repository);
	});

	it("Should be able to get an org by its Cnpj", async () => {
		const org: Org = {
			id: "1",
			cnpj: formattedCnpj,
			responsable_name: "Test Org",
			email: "testorg@example.com",
			password: "securepassword",
			whatsapp: "1234567890",
			cep: "12345-678",
			city: "Testville",
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
		};

		const createResponse = await repository.registerOrg(org);

		const response = await sut.execute(formattedCnpj);

		expect(response.org).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				cnpj: formattedCnpj,
				email: "testorg@example.com",
			})
		);
	});

	it("Should not be able to search for an org with invalid CNPJ", async () => {
		await expect(sut.execute("invalid_cnpj")).rejects.toBeInstanceOf(
			InvalidDataError
		);
	});

	it("Should not be able to get an org that doesnt exist", async () => {
		await expect(sut.execute(formattedCnpj)).rejects.toBeInstanceOf(
			ResourceNotFoundError
		);
	});
});
