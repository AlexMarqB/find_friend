import { ListOrgsByCityUseCase } from "@/domain/use-cases/org/listOrgsByCityUseCase";
import { ListPetsUseCase } from "@/domain/use-cases/pet/listPetsUseCase";
import { EnergyLevel, Size } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class ListPetsController {
    constructor(private useCase: ListPetsUseCase, private listOrgsUseCase: ListOrgsByCityUseCase) {}

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { city } = request.params as { city: string };

        const { query } = request as { query: { name?: string, about?: string, age?: number, size?: Size, energy_level?: EnergyLevel, breed?: string, adoption_requirements?: string } };

        const filtersSchema = z.object({
            name: z.string().optional(),
            about: z.string().optional(),
            age: z.coerce.number().int().optional(),
            size: z.nativeEnum(Size).optional(),
            energy_level: z.nativeEnum(EnergyLevel).optional(),
            breed: z.string().optional(),
            adoption_requirements: z.string().optional()
        });

        const validatedSchema = filtersSchema.safeParse(query);

        if (!validatedSchema.success) {
            return reply.status(400).send({
                error: 'Validation Error',
                details: validatedSchema.error.flatten()
            });
        }

        const filters = Object.fromEntries(
            Object.entries(validatedSchema.data).filter(([_, value]) => value !== undefined)
          );

        if (!city) {
            return reply.status(400).send({ error: 'City is required' });
        }

        try {
            const { orgs } = await this.listOrgsUseCase.execute(city);
            const pets = await this.useCase.execute(orgs, filters);

            return reply.status(200).send({ pets });
        } catch (error: any) {
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
