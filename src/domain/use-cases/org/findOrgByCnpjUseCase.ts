import { OrgRepository } from "@/domain/repositories/orgRepository";
import { InvalidDataError } from "@/errors/InvalidDataError";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { stringFormaters } from "@/utils";


export class FindOrgByCnpjUseCase {
    constructor(private repository: OrgRepository) {}

    async execute(cnpj: string) {
        if(!stringFormaters.validateCnpj(cnpj)) {
            throw new InvalidDataError("Invalid CNPJ");
        }

        const noDigitCnpj = stringFormaters.formatCnpjStringToNumber(cnpj);

        const org = await this.repository.findOrgByCnpj(noDigitCnpj);

        if(!org) {
            throw new ResourceNotFoundError("Org not found");
        }

        return {org}
    }
}