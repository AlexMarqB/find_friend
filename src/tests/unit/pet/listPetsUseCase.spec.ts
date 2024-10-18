import { OrgInMemoryRepository } from "@/domain/in-memory-repositories/OrgInMemoryRepository";
import { PetInMemoryRepository } from "@/domain/in-memory-repositories/PetInMemoryRepository";
import { OrgRepository } from "@/repositories/orgRepository";
import { PetRepository } from "@/repositories/petRepository";
import { ListPetsUseCase } from "@/domain/use-cases/pet/listPetsUseCase";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { EnergyLevel, Size } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

let sut: ListPetsUseCase;
let orgRepository: OrgRepository;
let repository: PetRepository;

describe("ListPetsUseCase unit test", async () => {

    beforeEach(async () => {
        repository = new PetInMemoryRepository();
        orgRepository = new OrgInMemoryRepository();
        sut = new ListPetsUseCase(repository);
    });

    it("Should be able to list all pets in the same city", async () => {
        await orgRepository.registerOrg({
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
        });

        await orgRepository.registerOrg({
            id: "2",
            cnpj: "98.436.729/0001-00",
            responsable_name: "Test Org",
            email: "testorg@example.com",
            password: "securepassword",
            whatsapp: "1234567890",
            cep: "22461-040",
            city: "Not Testville",
            street: "123 Test St",
            neighborhood: "Test Neighborhood",
            number: "123",
        });

        const pet1 = {
            id: "1",
            about: "Friendly and playful",
            adopted: false,
            age: 2,
            breed: "Labrador",
            energy_level: EnergyLevel.HIGH,
            name: "Buddy",
            org_id: "1",
            size: Size.MEDIUM,
            adoption_requirements: "High"
        };

        const pet2 = {
            id: "2",
            about: "Friendly and playful",
            adopted: false,
            age: 2,
            breed: "Labrador",
            energy_level: EnergyLevel.HIGH,
            name: "Buddy",
            org_id: "1",
            size: Size.MEDIUM,
            adoption_requirements: "Medium"
        };

        const pet3 = {
            id: "3",
            about: "Friendly and playful",
            adopted: false,
            age: 2,
            breed: "Labrador",
            energy_level: EnergyLevel.HIGH,
            name: "Buddy",
            org_id: "2",
            size: Size.MEDIUM,
            adoption_requirements: "Low"
        };

        const orgs = await orgRepository.listOrgsByCity("Testville");

        await repository.registerPet(pet1);
        await repository.registerPet(pet2);
        await repository.registerPet(pet3);

        const response = await sut.execute(orgs);

        expect(response.pets).toHaveLength(2);
        expect(response.pets).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: expect.any(String) }),
                expect.objectContaining({ id: expect.any(String) }),
            ])
        );
    });

    it("Should not be able to list pets when there are no pets in the city", async () => {
        const orgs = await orgRepository.listOrgsByCity("NonExistentCity");

        await expect(sut.execute(orgs)).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("Should be able to list pets with filters", async () => {
        await orgRepository.registerOrg({
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
        });

        const pet1 = {
            id: "1",
            about: "Friendly and playful",
            adopted: false,
            age: 2,
            breed: "Labrador",
            energy_level: EnergyLevel.HIGH,
            name: "Buddy",
            org_id: "1",
            size: Size.MEDIUM,
            adoption_requirements: "High"
        };

        const pet2 = {
            id: "2",
            about: "Calm and gentle",
            adopted: false,
            age: 4,
            breed: "Golden Retriever",
            energy_level: EnergyLevel.LOW,
            name: "Max",
            org_id: "1",
            size: Size.LARGE,
            adoption_requirements: "Medium"
        };

        await repository.registerPet(pet1);
        await repository.registerPet(pet2);

        const orgs = await orgRepository.listOrgsByCity("Testville");

        const response = await sut.execute(orgs, { energy_level: EnergyLevel.HIGH });

        expect(response.pets).toHaveLength(1);
        expect(response.pets).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: "1" }),
            ])
        );
    });
});