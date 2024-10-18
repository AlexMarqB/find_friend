import { PrismaClient, Prisma, Pet, Org } from "@prisma/client";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { PetRepository } from "@/repositories/petRepository";

const prisma = new PrismaClient();

export class PetPrismaRepository implements PetRepository {
    async registerPet(data: Prisma.PetUncheckedCreateInput) {
        const pet = await prisma.pet.create({
            data
        });

        return pet;
    }

    async listPets(orgs: Org[], filters?: Partial<Pet>) {
        const orgIds = orgs.map(org => org.id);

        const petsInCity = await prisma.pet.findMany({
            where: {
                org_id: {
                    in: orgIds,
                },
                ...filters,
            },
        });

        return petsInCity;
    }

    async getPetDetails(petId: string) {
        const pet = await prisma.pet.findUnique({
            where: {
                id: petId,
            },
        });

        if (!pet) {
            throw new ResourceNotFoundError("Pet not found");
        }

        return pet;
    }
}
