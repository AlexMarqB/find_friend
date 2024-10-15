import { PetRepository } from "@/repositories/petRepository";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { Org, Pet } from "@prisma/client";

export class ListPetsUseCase {
    constructor(private repository: PetRepository) {}

    async execute(orgs: Org[], filters?: Partial<Pet>) {
        
        if(orgs.length === 0) {
            throw new ResourceNotFoundError("No orgs found")
        }
        
        const pets = await this.repository.listPets(orgs, filters);

        if(pets.length === 0) {
            throw new ResourceNotFoundError("No pets found in this city");
        }

        return {pets}
    }
}