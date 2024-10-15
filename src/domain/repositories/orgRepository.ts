import { Org, Prisma } from "@prisma/client";

export interface OrgRepository {
    registerOrg(data: Prisma.OrgUncheckedCreateInput): Promise<Org>;
    listOrgsByCity(city: string): Promise<Org[]>;
    findOrgById(id: string): Promise<Org | null>;
    findOrgByCnpj(cnpj: string): Promise<Org | null>;
}