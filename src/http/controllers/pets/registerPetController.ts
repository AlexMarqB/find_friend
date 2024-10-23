import { RegisterPetUseCase } from "@/domain/use-cases/pet/registerPetUseCase";
import { InvalidDataError } from "@/errors/InvalidDataError";
import { EnergyLevel, Size } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class RegisterPetController {
	constructor(private useCase: RegisterPetUseCase) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const registerPetSchema = z.object({
			name: z.string(),
			about: z.string(),
			age: z.coerce.number().int(),
			size: z.nativeEnum(Size),
			energy_level: z.nativeEnum(EnergyLevel),
			breed: z.string(),
			adopted: z.boolean().default(false),
			adoption_requirements: z.string(),
		});

		const {sub} = request.user

		try {
			const validatedSchema = registerPetSchema.safeParse(request.body);

			if (!validatedSchema.success) {
				return reply.status(400).send({
					error: "Validation Error",
					details: validatedSchema.error.flatten(),
				});
			}

			const {pet} = await this.useCase.execute({
				...validatedSchema.data,
				org_id: sub,
			});

			return reply
				.status(201)
				.send({ message: "Pet registered successfully", pet });
		} catch (error: any) {
			if (error instanceof InvalidDataError) {
				return reply
					.status(500)
					.send({ error: "Invalid Data", message: error.message });
			}
			return reply.status(500).send({ error: "Internal Server Error" });
		}
	}
}
