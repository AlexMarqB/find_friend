import { FindOrgByIdUseCase } from "@/domain/use-cases/org/findOrgByIdUseCase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class OrgDataController {
	constructor(private useCase: FindOrgByIdUseCase) {}

	async handle(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const getDataSchema = z.string();

		try {
			const validatedSchema = getDataSchema.safeParse(request.params.id);

			if (!validatedSchema.success) {
				return reply.status(400).send({
					error: "Validation Error",
					details: validatedSchema.error.flatten(),
				});
			}

			const orgId = request.user.sub;

			const org = await this.useCase.execute(orgId);

			return reply.status(200).send(org);
		} catch (error) {
			return reply.status(400).send({
				error: "Validation Error"
			});
		}
	}
}
