import { ListPetsUseCase } from "@/domain/use-cases/pet/listPetsUseCase";
import { RegisterPetUseCase } from "@/domain/use-cases/pet/registerPetUseCase";
import { OrgPrismaRepository } from "@/http/prisma-repositories/OrgPrismaRepository";
import { PetPrismaRepository } from "@/http/prisma-repositories/PetPrismaRepository";
import { RegisterPetController } from "./registerPetController";
import { ListOrgsByCityUseCase } from "@/domain/use-cases/org/listOrgsByCityUseCase";
import { ListPetsController } from "./listPetsController";
import { GetPetDetailsUseCase } from "@/domain/use-cases/pet/getPetDetailsUseCase";
import { GetPetDetailsController } from "./getPetDetailsController";

const repository = new PetPrismaRepository();
const orgRepository = new OrgPrismaRepository();
let useCase;

export async function registerPetController() {
    useCase = new RegisterPetUseCase(repository, orgRepository);

    return new RegisterPetController(useCase).handle;
}

export async function listPetsController() {
    useCase = new ListPetsUseCase(repository);
    const listOrgsUseCase = new ListOrgsByCityUseCase(orgRepository);

    return new ListPetsController(useCase, listOrgsUseCase).handle;
}

export async function getPetDetailsController() {
    useCase = new GetPetDetailsUseCase(repository);

    return new GetPetDetailsController(useCase).handle;
}