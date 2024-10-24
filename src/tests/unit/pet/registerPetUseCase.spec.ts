import { OrgInMemoryRepository } from "@/domain/in-memory-repositories/OrgInMemoryRepository";
import { PetInMemoryRepository } from "@/domain/in-memory-repositories/PetInMemoryRepository";
import { OrgRepository } from "@/repositories/orgRepository";
import { PetRepository } from "@/repositories/petRepository";
import { RegisterPetUseCase } from "@/domain/use-cases/pet/registerPetUseCase";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { EnergyLevel, Pet, Size } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

let sut: RegisterPetUseCase;
let orgRepository: OrgRepository;
let repository: PetRepository;

describe("registerPetUseCase unit test", async () => {
    beforeEach(async () => {
        repository = new PetInMemoryRepository();
        orgRepository = new OrgInMemoryRepository();
        sut = new RegisterPetUseCase(repository, orgRepository);
    });

    it("Should be able to register a new Pet", async () => {
        const createOrgResponse = await orgRepository.registerOrg({
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
        })

        const pet: Pet = {
            id: "1",
            about: "Friendly and playful",
            adopted: false,
            age: 2,
            breed: "Labrador",
            energy_level: EnergyLevel.HIGH,
            name: "Buddy",
            org_id: createOrgResponse.id,
            size: Size.LARGE,
            adoption_requirements: "Requires a large yard and daily exercise"
        };

        const response = await sut.execute(pet);

        expect(response.pet).toEqual(
            expect.objectContaining({ id: expect.any(String) })
        );
    });

    it("Should not be able to register a pet without an existing org", async () => {
        const pet: Pet = {
            id: "1",
            about: "Friendly and playful",
            adopted: false,
            age: 2,
            breed: "Labrador",
            energy_level: EnergyLevel.HIGH,
            name: "Buddy",
            org_id: "1",
            size: Size.LARGE,
            adoption_requirements: "Requires a large yard and daily exercise"
        };

        await expect(sut.execute(pet)).rejects.toBeInstanceOf(ResourceNotFoundError);
    })
});
