import { AuthenticateOrgUseCase } from "@/domain/use-cases/org/authenticateOrgUseCase";
import { AuthenticateOrgController } from "./auth/authenticateOrgController";
import { OrgPrismaRepository } from "@/http/prisma-repositories/OrgPrismaRepository";
import { RefreshTokenController } from "./auth/refreshTokenController";
import { RegisterOrgController } from "./registerOrgController";
import { RegisterOrgUseCase } from "@/domain/use-cases/org/registerOrgUseCase";
import { OrgDataController } from "./orgDataController";
import { FindOrgByIdUseCase } from "@/domain/use-cases/org/findOrgByIdUseCase";

// Instancia o repositório uma única vez
const repository = new OrgPrismaRepository();

// Cria uma função para instanciar controllers e usar a função handle diretamente
//@ts-ignore
const createHandler = (Controller, UseCase) => {
    const useCase = new UseCase(repository);
    const controller = new Controller(useCase);
    return controller.handle.bind(controller);
};

// Exporta os handlers
export const registerOrgHandler = () => createHandler(RegisterOrgController, RegisterOrgUseCase);
export const authenticateOrgHandler = () => createHandler(AuthenticateOrgController, AuthenticateOrgUseCase);
export const refreshTokenHandler = () => new RefreshTokenController().handle.bind(new RefreshTokenController());
export const orgDataHandler = () => createHandler(OrgDataController, FindOrgByIdUseCase);
