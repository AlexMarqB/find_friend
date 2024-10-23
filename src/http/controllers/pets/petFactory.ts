import { ListPetsUseCase } from "@/domain/use-cases/pet/listPetsUseCase";
import { RegisterPetUseCase } from "@/domain/use-cases/pet/registerPetUseCase";
import { OrgPrismaRepository } from "@/http/prisma-repositories/OrgPrismaRepository";
import { PetPrismaRepository } from "@/http/prisma-repositories/PetPrismaRepository";
import { RegisterPetController } from "./registerPetController";
import { ListOrgsByCityUseCase } from "@/domain/use-cases/org/listOrgsByCityUseCase";
import { ListPetsController } from "./listPetsController";
import { GetPetDetailsUseCase } from "@/domain/use-cases/pet/getPetDetailsUseCase";
import { GetPetDetailsController } from "./getPetDetailsController";

// Instancia os repositórios uma única vez
const petRepository = new PetPrismaRepository();
const orgRepository = new OrgPrismaRepository();
// Função para criar e retornar o handler do controller
//@ts-ignore
const createHandler = (Controller, UseCase, additionalRepository?, additionalUseCase?) => {
    let useCase;

    if (additionalUseCase) {
        useCase = new UseCase(petRepository, additionalRepository ?? null);
        const additionalUseCaseInstance = new additionalUseCase(additionalRepository);
        const controller = new Controller(useCase, additionalUseCaseInstance);
        return controller.handle.bind(controller);
    }

    useCase = new UseCase(petRepository, additionalRepository ?? null);
    const controller = new Controller(useCase);
    return controller.handle.bind(controller);
};

// Exporta os handlers
export const registerPetHandler = () => createHandler(RegisterPetController, RegisterPetUseCase, orgRepository);
export const listPetsHandler = () => createHandler(ListPetsController, ListPetsUseCase, orgRepository, ListOrgsByCityUseCase);
export const getPetDetailsHandler = () => createHandler(GetPetDetailsController, GetPetDetailsUseCase);

