import { Prisma, Pet, Org } from "@prisma/client";
import cuid from "cuid";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { PetRepository } from "@/repositories/petRepository";

export class PetInMemoryRepository implements PetRepository {
    private items: Pet[] = [];

    async registerPet(data: Prisma.PetUncheckedCreateInput) {
        const pet = {
            ...data,
            id: data.id ?? cuid(),
            adopted: false,
        }

        this.items.push(pet);

        return pet;
    }

    async listPets(orgs: Org[], filters?: Partial<Pet>) {
        
        const petsInCity = this.items.filter(pet => orgs.some(org => org.id === pet.org_id));

        if (!filters) return petsInCity; // If no filters are provided, return all items

        const filteredPets = petsInCity.filter(pet => {
            for (const key in filters) {
                if (Object.prototype.hasOwnProperty.call(filters, key)) {
                    if (filters[key as keyof Pet] !== undefined && pet[key as keyof Pet] !== filters[key as keyof Pet]) {
                        return false;
                    }
                }
            }
            return true;
        });
    
        return filteredPets;
    }

    async getPetDetails(petId: string) {
        const pet = this.items.find(pet => pet.id === petId) ?? null;

        if(!pet) {
            throw new ResourceNotFoundError("Pet not found");
        }

        return pet;
    }
    
}