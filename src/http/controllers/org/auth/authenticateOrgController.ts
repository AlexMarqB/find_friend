import { AuthenticateOrgUseCase } from "@/domain/use-cases/org/authenticateOrgUseCase";
import { InvalidDataError } from "@/errors/InvalidDataError";
import { ResourceNotFoundError } from "@/errors/NotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class AuthenticateOrgController {
	constructor(private useCase: AuthenticateOrgUseCase) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const authenticateOrgSchema = z.object({
			cnpj: z.string().max(18),
			password: z.string().min(6),
		});

		try {
			const validatedSchema = authenticateOrgSchema.safeParse(request.body);

			if (!validatedSchema.success) {
				return reply.status(400).send({
					error: "Validation Error",
					details: validatedSchema.error.flatten(),
				});
			}

			const { org } = await this.useCase.execute(
				validatedSchema.data.cnpj,
				validatedSchema.data.password
			);

			/**
			 * Generates a JWT token for the authenticated organization
			 * The token is signed with the organization's ID (`org.id`) as the subject (`sub`)
			 * and is set to expire in 7 days (`expiresIn: '7d'`).
			 */
			const token = await reply.jwtSign(
				{},
				{
					sign: {
						sub: org.id,
						expiresIn: "7d",
					},
				}
			);

			const refreshToken = await reply.jwtSign(
				{},
				{
					sign: {
						sub: org.id,
						expiresIn: "15m",
					},
				}
			);

			return reply
				.setCookie("refreshToken", refreshToken, {
					path: "/",
					httpOnly: true,
					sameSite: true,
					secure: true,
				})
				.status(200)
				.send({
					message: "Organization authenticated successfully",
					token,
				});
		} catch (error: any) {
			if (
				error instanceof InvalidDataError ||
				error instanceof ResourceNotFoundError
			) {
				return reply
					.status(500)
					.send({ error: "Database Error", message: error.message });
			}

			console.error("Internal error occurred:", error);
			return reply.status(500).send({ error: "Internal Server Error" });
		}
	}
}
