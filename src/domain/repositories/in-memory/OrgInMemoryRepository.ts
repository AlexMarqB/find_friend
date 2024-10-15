import { Prisma, Org } from "@prisma/client";
import { OrgRepository } from "../orgRepository";
import cuid from "cuid";

export class OrgInMemoryRepository implements OrgRepository {
	private items: Org[] = [];

	async registerOrg(data: Prisma.OrgUncheckedCreateInput) {
		const org: Org = {
			id: cuid(),
			responsable_name: data.responsable_name,
			email: data.email,
			city: data.city,
			cep: data.cep,
			cnpj: data.cnpj,
			neighborhood: data.neighborhood,
			number: data.number,
			password: data.password,
			street: data.street,
			whatsapp: data.whatsapp,
		};

		this.items.push(org);

		return org;
	}

	async findOrgById(id: string) {
		return this.items.find((org) => org.id === id) ?? null;
	}

	async findOrgByCnpj(cnpj: string) {
		return this.items.find((org) => org.cnpj === cnpj) ?? null;
	}

	async listOrgsByCity(city: string) {
		return this.items.filter((org) => org.city === city);
	}
}
