import { OrgRepository } from "@/repositories/orgRepository";
import { PrismaClient, Prisma, Org } from "@prisma/client";

const prisma = new PrismaClient();

export class OrgPrismaRepository implements OrgRepository {
    async registerOrg(data: Prisma.OrgUncheckedCreateInput) {
        const org = await prisma.org.create({
            data
        });

        return org;
    }

    async findOrgById(id: string) {
        return await prisma.org.findUnique({
            where: { id },
        });
    }

    async findOrgByCnpj(cnpj: string) {
        return await prisma.org.findUnique({
            where: { cnpj },
        });
    }

    async listOrgsByCity(city: string) {
        return await prisma.org.findMany({
            where: { city },
        });
    }
}
