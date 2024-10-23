import { GetPetDetailsUseCase } from "@/domain/use-cases/pet/getPetDetailsUseCase";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";

export class GetPetDetailsController {
    constructor(private useCase: GetPetDetailsUseCase) {}

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };

        if (!id) {
            return reply.status(400).send({ error: 'Pet ID is required' });
        }

        try {
            const {pet} = await this.useCase.execute(id);

            return reply.status(200).send({pet});
        } catch (error: any) {
            if(error instanceof ResourceNotFoundError) {
                return reply.status(404).send({ error: 'Pet not found', message: error.message });
            }
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}