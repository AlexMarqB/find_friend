import { describe, it, expect, beforeEach } from 'vitest';
import { ListOrgsByCityUseCase } from '@/domain/use-cases/org/listOrgsByCityUseCase';
import { OrgRepository } from '@/repositories/orgRepository';
import { ResourceNotFoundError } from '@/errors/NotFoundError';
import { OrgInMemoryRepository } from "@/tests/unit/in-memory-repositories/OrgInMemoryRepository";
import { stringFormaters } from '@/utils';

describe('ListOrgsByCityUseCase unit test', () => {
    let sut: ListOrgsByCityUseCase;
    let repository: OrgRepository;

    beforeEach(() => {
        repository = new OrgInMemoryRepository();
        sut = new ListOrgsByCityUseCase(repository);
    });

    it('Should return a list of organizations filtered by the city', async () => {
        await repository.registerOrg({
			id: "1",
			cnpj: stringFormaters.formatCnpjStringToNumber("98.436.729/0001-00"),
			responsable_name: "Test Org",
			email: "testorg@example.com",
			password: "securepassword",
			whatsapp: "1234567890",
			cep: "22461-040",
			city: "Testville",
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
		})

        await repository.registerOrg( {
			id: "2",
			cnpj: stringFormaters.formatCnpjStringToNumber("51.279.903/0001-94"),
			responsable_name: "Test Org",
			email: "testorg@example.com",
			password: "securepassword",
			whatsapp: "1234567890",
			cep: "22461-040",
			city: "Testville",
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
		})

        await repository.registerOrg({
            id: "3",
			cnpj: stringFormaters.formatCnpjStringToNumber("29.031.695/0001-50"),
			responsable_name: "Test Org",
			email: "testorg@example.com",
			password: "securepassword",
			whatsapp: "1234567890",
			cep: "22461-040",
			city: "Not Testville",
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
        })

        const result = await sut.execute("Testville");

        expect(result.orgs).toHaveLength(2);
        expect(result.orgs[0]).toEqual(expect.objectContaining({ id: expect.any(String), city: "Testville" }));
    });

    it('Should not return a list when there are no organizations', async () => {
        await expect(sut.execute("Testville")).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});