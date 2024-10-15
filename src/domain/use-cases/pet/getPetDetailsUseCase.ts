import { PetRepository } from "@/repositories/petRepository";
import { ResourceNotFoundError } from "@/errors/NotFoundError";

export class GetPetDetailsUseCase {
    constructor(private repository: PetRepository) {}

    async execute(petId: string) {
        const pet = await this.repository.getPetDetails(petId);

        if(!pet) {
            throw new ResourceNotFoundError("Pet not found");
        }

        return {pet}
    }
}