import { PetRepository } from "@/repositories/petRepository";
import { GetPetDetailsUseCase } from "@/domain/use-cases/pet/getPetDetailsUseCase";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { EnergyLevel, Pet, Size } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { PetInMemoryRepository } from "@/domain/in-memory-repositories/PetInMemoryRepository";

let sut: GetPetDetailsUseCase;
let repository: PetRepository;

describe("GetPetDetailsUseCase unit test", async () => {
	beforeEach(async () => {
		repository = new PetInMemoryRepository();
		sut = new GetPetDetailsUseCase(repository);
	});

	it("Should be able to get a Pet by its Id", async () => {
		const pet: Pet = {
			id: "1",
			about: "Friendly and playful",
			adopted: false,
			age: 2,
			breed: "Labrador",
			energy_level: EnergyLevel.HIGH,
			name: "Buddy",
			org_id: "org-123",
			size: Size.LARGE,
			adoption_requirements: "High"
		};

		const createResponse = await repository.registerPet(pet);

		const response = await sut.execute(createResponse.id);

		expect(response.pet).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				name: "Buddy",
				adoption_requirements: "High"
			})
		);
	});

	it("Should not be able to get a Pet that doesn't exist", async () => {
		await expect(sut.execute("unexisting_id")).rejects.toBeInstanceOf(
			ResourceNotFoundError
		);
	});
});
