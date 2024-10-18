import { FastifyReply, FastifyRequest } from "fastify";

export class RefreshTokenController {
	async handle(request: FastifyRequest, reply: FastifyReply) {
		request.jwtVerify();

		const orgId = request.user.sub;

		const token = await reply.jwtSign(
			{},
			{
				sign: {
					sub: orgId,
				},
			}
		);

		const refreshToken = await reply.jwtSign(
			{},
			{
				sign: {
					sub: orgId,
					expiresIn: "7d",
				},
			}
		);

		return reply
			.setCookie("refreshToken", refreshToken, {
				path: "/", //quais rotas terão acesso ao cookie
				secure: true, // só aceita requisições https
				sameSite: true, // só aceita requisições do mesmo site
				httpOnly: true, // só aceita requisições da api não fica salvo no browser
			})
			.status(200)
			.send({ token });
	}
}
