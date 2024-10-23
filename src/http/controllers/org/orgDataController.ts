import { FindOrgByIdUseCase } from "@/domain/use-cases/org/findOrgByIdUseCase";
import { FastifyReply, FastifyRequest } from "fastify";

export class OrgDataController {
	constructor(private useCase: FindOrgByIdUseCase) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const {sub} = request.user;
		try {

			const {org} = await this.useCase.execute(sub);

			return reply.status(200).send({
				org: {
					...org,
					password: undefined,
				}
			});
		} catch (error) {
			return reply.status(400).send({
				error: "Validation Error"
			});
		}
	}
}
