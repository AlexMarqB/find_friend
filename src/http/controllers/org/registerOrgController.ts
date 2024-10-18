import { RegisterOrgUseCase } from "@/domain/use-cases/org/registerOrgUseCase";
import { InvalidDataError } from "@/errors/InvalidDataError";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class RegisterOrgController {
    constructor(private useCase: RegisterOrgUseCase) {}

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const registerOrgSchema = z.object({
            cnpj: z.string().length(14),
            responsable_name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
            whatsapp: z.string(),
            cep: z.string(),
            city: z.string(),
            street: z.string(),
            neighborhood: z.string(),
            number: z.string(),
        });

        try {
            const validatedSchema = registerOrgSchema.safeParse(request.body);

            if (!validatedSchema.success) {
                // Retornar detalhes do erro de validação
                return reply.status(400).send({ 
                    error: 'Validation Error',
                    details: validatedSchema.error.flatten() 
                });
            }

            const org = await this.useCase.execute(validatedSchema.data);
            return reply.status(201).send({ message: 'Organization registered successfully', org });

        } catch (error: any) { // use 'any' para capturar todos os tipos de erro
            if (error instanceof InvalidDataError) {
                return reply.status(500).send({ error: 'Invalid Data', message: error.message });
            }
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
