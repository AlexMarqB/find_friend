import { OrgRepository } from "@/domain/repositories/orgRepository";
import { InvalidDataError } from "@/errors/InvalidDataError";
import { _bcrypt } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma";
import { stringFormaters } from "@/utils";
import { Prisma } from "@prisma/client";

export class RegisterOrgUseCase {
    constructor(private repository: OrgRepository) {}

    async execute(data: Prisma.OrgUncheckedCreateInput) {

        // Validating and formatting CNPJ
        if(!stringFormaters.validateCnpj(data.cnpj)) {
            throw new InvalidDataError("Invalid CNPJ");
        }

        const noDigitCnpj = stringFormaters.formatCnpjStringToNumber(data.cnpj);

        const orgExists = await this.repository.findOrgByCnpj(noDigitCnpj);

        if(orgExists) {
            throw new InvalidDataError("Invalid CNPJ");
        }

        // Validating and formating CEP
        if(!stringFormaters.validateCep(data.cep)) {
            throw new InvalidDataError("Invalid CEP");
        }

        const noDigitCep = stringFormaters.formatCepStringToNumber(data.cep);

        const hashPassword = await _bcrypt.hash(data.password, 6)

        const org = await this.repository.registerOrg({...data, cnpj: noDigitCnpj, cep: noDigitCep, password: hashPassword});

        return {org}
    }
}