import { OrgInMemoryRepository } from "@/domain/in-memory-repositories/OrgInMemoryRepository";
import { OrgRepository } from "@/repositories/orgRepository";
import { FindOrgByIdUseCase } from "@/domain/use-cases/org/findOrgByIdUseCase";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { stringFormaters } from "@/utils";
import { Org } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

let sut: FindOrgByIdUseCase;
let repository: OrgRepository;

const formattedCnpj =
	stringFormaters.formatCnpjStringToNumber("98.436.729/0001-00");

describe("FindOrgByIdUseCase unit test", async () => {
	beforeEach(async () => {
		repository = new OrgInMemoryRepository();
		sut = new FindOrgByIdUseCase(repository);
	});

	it("Should be able to get an org by its Id", async () => {
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

		const response = await sut.execute(createResponse.id);

		expect(response.org).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				email: "testorg@example.com",
			})
		);
	});

	it("Should not be able to get an org that doesnt exist", async () => {
		await expect(sut.execute("unexisting_id")).rejects.toBeInstanceOf(
			ResourceNotFoundError
		);
	});
});