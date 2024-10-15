import { OrgRepository } from "@/repositories/orgRepository";
import { PetRepository } from "@/repositories/petRepository";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { Pet, Prisma } from "@prisma/client";


export class RegisterPetUseCase {
    constructor(private repository: PetRepository,private orgRepository: OrgRepository) {}

    async execute(data: Prisma.PetUncheckedCreateInput) {
        const org = await this.orgRepository.findOrgById(data.org_id);

        if(!org) {
            throw new ResourceNotFoundError("Org not found")
        }

        const pet = await this.repository.registerPet(data);

        return {pet}
    }
}