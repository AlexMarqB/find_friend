import { InvalidDataError } from "@/errors/InvalidDataError";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { _bcrypt } from "@/lib/bcrypt";
import { OrgRepository } from "@/repositories/orgRepository";
import { stringFormaters } from "@/utils";

export class AuthenticateOrgUseCase {
    constructor(private repository: OrgRepository) {}

    async execute(cnpj: string, password: string) {

        if(!stringFormaters.validateCnpj(cnpj)) {
            throw new InvalidDataError('Invalid data');
        }

        const noDigitCnpj = stringFormaters.formatCnpjStringToNumber(cnpj);

        const org = await this.repository.findOrgByCnpj(noDigitCnpj);

        if (!org) {
            throw new ResourceNotFoundError('There is no organization with this CNPJ');
        }

        const isPasswordValid = await _bcrypt.compare(password, org.password);

        if (!isPasswordValid) {
            throw new InvalidDataError('Invalid data');
        }

        return {org};
    }
}