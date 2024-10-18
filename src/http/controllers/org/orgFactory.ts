import { AuthenticateOrgUseCase } from "@/domain/use-cases/org/authenticateOrgUseCase";
import { AuthenticateOrgController } from "./auth/authenticateOrgController";
import { OrgPrismaRepository } from "@/http/prisma-repositories/OrgPrismaRepository";
import { RefreshTokenController } from "./auth/refreshTokenController";
import { RegisterOrgController } from "./registerOrgController";
import { RegisterOrgUseCase } from "@/domain/use-cases/org/registerOrgUseCase";

const repository = new OrgPrismaRepository();
let useCase;

export async function registerOrgController() {
	useCase = new RegisterOrgUseCase(repository);

	return new RegisterOrgController(useCase).handle;
}

export async function authenticateOrgController() {
	useCase = new AuthenticateOrgUseCase(repository);

	return new AuthenticateOrgController(useCase).handle;
}

export async function refreshTokenController() {
	return new RefreshTokenController().handle;
}
