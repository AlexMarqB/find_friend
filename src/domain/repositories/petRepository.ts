import { Org, Pet, Prisma } from "@prisma/client";

export interface PetRepository {
    registerPet(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
    listPets(orgs: Org[], filters?: Partial<Pet>): Promise<Pet[]>;
    getPetDetails(petId: string): Promise<Pet>;
}