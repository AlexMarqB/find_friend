import { OrgRepository } from "@/domain/repositories/orgRepository";
import { ResourceNotFoundError } from "@/errors/NotFoundError";


export class ListOrgsByCityUseCase {
    constructor(private repository: OrgRepository) {}

    async execute(city: string) {
        const orgs = await this.repository.listOrgsByCity(city);

        if(orgs.length === 0) {
            throw new ResourceNotFoundError("No orgs found");
        }

        return {orgs};
    }
}