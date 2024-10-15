import { OrgRepository } from "@/domain/repositories/orgRepository";
import { ResourceNotFoundError } from "@/errors/NotFoundError";


export class FindOrgByIdUseCase {
    constructor(private repository: OrgRepository) {}

    async execute(id: string) {
        const org = await this.repository.findOrgById(id);

        if(!org) {
            throw new ResourceNotFoundError("Org not found");
        }
        
        return {org};
    }
}